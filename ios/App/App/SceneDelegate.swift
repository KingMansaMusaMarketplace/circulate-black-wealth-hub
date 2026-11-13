import UIKit
import Capacitor

// iOS 27 stops apps at launch unless they use Apple's scene-based startup.
// The window is created from Main.storyboard (set in Info.plist), and link
// opens are forwarded to Capacitor exactly as AppDelegate did before.
@objc(SceneDelegate)
class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }
        // Build the window ourselves so startup never depends on storyboard lookup.
        if window == nil {
            let newWindow = UIWindow(windowScene: windowScene)
            newWindow.rootViewController = UIStoryboard(name: "Main", bundle: nil).instantiateInitialViewController() ?? CAPBridgeViewController()
            window = newWindow
        }
        window?.makeKeyAndVisible()
        // Some plugins still look for the window on the app delegate.
        (UIApplication.shared.delegate as? AppDelegate)?.window = window

        // Links that launched the app from a cold start.
        if let url = connectionOptions.urlContexts.first?.url {
            _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, open: url, options: [:])
        }
        if let activity = connectionOptions.userActivities.first {
            _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, continue: activity, restorationHandler: { _ in })
        }
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let url = URLContexts.first?.url else { return }
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, open: url, options: [:])
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
    }
}
