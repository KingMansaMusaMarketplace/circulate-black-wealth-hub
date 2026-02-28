import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Loader2, Music, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from '@/components/merch/CartDrawer';
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, ShopifyProduct } from '@/lib/shopify/config';
import { toast } from 'sonner';

const PRODUCT_FALLBACK_IMAGES: Record<string, string> = {
  'mansa-musa-1325-baseball-jersey': '/images/mansa-musa-jersey.png',
  '1325-ai-backpack': '/images/1325-ai-backpack.png',
  '1325-ai-camo-t-shirt': '/images/1325-ai-camo-tshirt.png',
  '1325-ai-insulated-tumbler': '/images/1325-ai-tumbler.png',
};

const MerchStorePage = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [musicGenerating, setMusicGenerating] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.7);
  const [musicReady, setMusicReady] = useState(false);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const musicBlobUrlRef = useRef<string | null>(null);
  const addItem = useCartStore(state => state.addItem);
  const isCartLoading = useCartStore(state => state.isLoading);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first: 50 });
        setProducts(data?.data?.products?.edges || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const generateMusic = useCallback(async () => {
    if (musicGenerating || musicReady) return;
    setMusicGenerating(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const response = await fetch(`${supabaseUrl}/functions/v1/elevenlabs-music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          prompt: 'Epic, cinematic hip-hop beat with African drums and gold-themed luxury vibes, instrumental only',
          duration: 30,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate music');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      musicBlobUrlRef.current = url;

      const audio = new Audio(url);
      audio.loop = true;
      audio.volume = musicVolume;
      musicAudioRef.current = audio;

      audio.addEventListener('canplaythrough', () => {
        setMusicReady(true);
      });

      toast.success('🎵 Original AI music generated!');
    } catch (error: any) {
      console.error('Music generation error:', error);
      toast.error('Failed to generate music', { description: error.message });
    } finally {
      setMusicGenerating(false);
    }
  }, [musicGenerating, musicReady, musicVolume]);

  const toggleMusicPlayback = useCallback(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.play().then(() => setMusicPlaying(true)).catch(console.error);
    }
  }, [musicPlaying]);

  const toggleMusicMute = useCallback(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;
    audio.muted = !musicMuted;
    setMusicMuted(!musicMuted);
  }, [musicMuted]);

  const handleVolumeChange = useCallback((value: number[]) => {
    const vol = value[0];
    setMusicVolume(vol);
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = vol;
    }
  }, []);

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (musicBlobUrlRef.current) {
        URL.revokeObjectURL(musicBlobUrlRef.current);
      }
      musicAudioRef.current?.pause();
    };
  }, []);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    });
    toast.success(`${product.node.title} added to cart!`);
  };

  return (
    <>
      <Helmet>
        <title>Merch Store | 1325.AI</title>
        <meta name="description" content="Shop official 1325.AI branded merchandise. Represent the movement with premium apparel and accessories." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="h-10 w-10 text-mansagold" />
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">MMM Official Merch</h1>
            </div>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Wear the movement. Premium branded merchandise from 1325.AI — every purchase supports the mission.
            </p>
            <div className="mt-6">
              <CartDrawer />
            </div>
          </div>
        </section>

        {/* Promo Video Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="rounded-xl overflow-hidden shadow-2xl border border-border bg-card">
              <video
                src="/videos/MANSA_MUSA_JERSEY_PROMO.mov"
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover"
                poster="/images/mansa-musa-jersey.png"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-mansagold to-amber-400 bg-clip-text text-transparent">
                Mansa Musa 1325 Jersey
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Rock the legacy. Our signature baseball jersey pays homage to the richest man in history — designed for those who move culture and circulate wealth.
              </p>
              <Link to="/merch/mansa-musa-1325-baseball-jersey">
                <Button size="lg" className="bg-mansagold hover:bg-mansagold/90 text-black font-bold mt-2">
                  Shop Now
                </Button>
              </Link>

              {/* AI Music Controls */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {!musicReady ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateMusic}
                    disabled={musicGenerating}
                    className="border-mansagold/50 text-mansagold hover:bg-mansagold/10"
                  >
                    {musicGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Music className="mr-2 h-4 w-4" />
                        Generate Original Music
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={toggleMusicPlayback}>
                      {musicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={toggleMusicMute}>
                      {musicMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[musicVolume]}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.05}
                      className="w-24"
                    />
                    <span className="text-xs text-muted-foreground ml-1">AI Music</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground/60 italic">
                🎵 Original AI-generated music by 1325.AI — royalty-free, no copyright issues
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container mx-auto px-4 py-16">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Loading products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No products yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Our merch store is being stocked! Check back soon for official 1325.AI branded merchandise.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const image = product.node.images.edges[0]?.node;
                const fallbackImage = PRODUCT_FALLBACK_IMAGES[product.node.handle];
                const imageUrl = image?.url || fallbackImage;
                const imageAlt = image?.altText || product.node.title;
                const price = product.node.priceRange.minVariantPrice;
                
                return (
                  <div key={product.node.id} className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <Link to={`/merch/${product.node.handle}`}>
                    <div className="aspect-square bg-muted overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={imageAlt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link to={`/merch/${product.node.handle}`}>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                          {product.node.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {product.node.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-foreground">
                          ${parseFloat(price.amount).toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          disabled={isCartLoading}
                        >
                          {isCartLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default MerchStorePage;
