import { Capacitor } from '@capacitor/core';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Apple IAP Product IDs - must match App Store Connect.
// Only Essentials + Starter are sold via Apple IAP.
// Pro / Enterprise remain web-only (Stripe at 1325.ai).
export const APPLE_PRODUCT_IDS = {
  ESSENTIALS: 'com.mansamusa.essentials.monthly',  // $19/mo
  STARTER:    'com.mansamusa.starter.monthly',     // $79/mo
} as const;

export type AppleProductId = typeof APPLE_PRODUCT_IDS[keyof typeof APPLE_PRODUCT_IDS];

export const IOS_WEB_ONLY_TIERS = ['pro', 'business_pro', 'business_pro_kayla', 'enterprise'] as const;

const ALL_PRODUCT_IDS: AppleProductId[] = [
  APPLE_PRODUCT_IDS.ESSENTIALS,
  APPLE_PRODUCT_IDS.STARTER,
];

/**
 * Apple IAP Service — uses cordova-plugin-purchase (CdvPurchase) which
 * talks directly to Apple StoreKit. Receipts are validated server-side
 * via the validate-apple-receipt edge function.
 *
 * Setup required outside this file:
 *  1. App Store Connect: create the two products with IDs above ($19, $79).
 *  2. Run `npx cap sync ios` after install — Capacitor auto-installs the
 *     CdvPurchase plugin pod.
 *  3. Enable In-App Purchase capability in Xcode for the App target.
 */
class AppleIAPService {
  private store: any = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private isIOS(): boolean {
    return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios';
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      if (!this.isIOS()) {
        console.log('[Apple IAP] Not on iOS — skipping init');
        return;
      }

      try {
        // Dynamic import so web bundle doesn't choke on cordova globals
        const mod: any = await import('cordova-plugin-purchase');
        const CdvPurchase = mod.CdvPurchase ?? (window as any).CdvPurchase;
        if (!CdvPurchase) throw new Error('CdvPurchase not available');

        this.store = CdvPurchase.store;

        // Register products
        for (const id of ALL_PRODUCT_IDS) {
          this.store.register({
            id,
            type: CdvPurchase.ProductType.PAID_SUBSCRIPTION,
            platform: CdvPurchase.Platform.APPLE_APPSTORE,
          });
        }

        // Hook up handlers
        this.store.when()
          .approved((transaction: any) => {
            console.log('[Apple IAP] Transaction approved:', transaction.transactionId);
            transaction.verify();
          })
          .verified(async (receipt: any) => {
            console.log('[Apple IAP] Receipt verified locally, sending to server');
            try {
              await this.validateReceipt(
                receipt.nativePurchase?.appStoreReceipt ?? receipt.id,
              );
              receipt.finish();
              toast.success('Subscription activated!');
            } catch (err) {
              console.error('[Apple IAP] Server validation failed:', err);
              toast.error('Could not activate subscription — please contact support.');
            }
          })
          .unverified((receipt: any) => {
            console.error('[Apple IAP] Receipt unverified:', receipt);
            toast.error('Purchase could not be verified.');
          });

        this.store.error((err: any) => {
          console.error('[Apple IAP] Store error:', err);
          if (err?.code !== CdvPurchase.ErrorCode.PAYMENT_CANCELLED) {
            toast.error(err?.message ?? 'Purchase failed');
          }
        });

        await this.store.initialize([CdvPurchase.Platform.APPLE_APPSTORE]);
        this.initialized = true;
        console.log('[Apple IAP] Initialized');
      } catch (error) {
        console.error('[Apple IAP] Init failed:', error);
        this.initPromise = null;
        throw error;
      }
    })();

    return this.initPromise;
  }

  async purchase(productId: AppleProductId) {
    if (!this.isIOS()) throw new Error('Apple IAP is only available on iOS');
    await this.initialize();

    const product = this.store?.get(productId);
    if (!product) throw new Error(`Product not loaded: ${productId}`);

    const offer = product.getOffer();
    if (!offer) throw new Error('No offer available for this product');

    console.log('[Apple IAP] Ordering offer for', productId);
    return offer.order();
  }

  async restorePurchases() {
    if (!this.isIOS()) throw new Error('Apple IAP is only available on iOS');
    await this.initialize();
    console.log('[Apple IAP] Restoring purchases…');
    await this.store.restorePurchases();
    toast.info('Restoring previous purchases…');
  }

  async validateReceipt(receiptData: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('validate-apple-receipt', {
      body: { receiptData, productId: null },
    });
    if (error) throw error;
    return data;
  }
}

export const appleIAPService = new AppleIAPService();
