# iOS
- The iOS app starts through SceneDelegate.swift (window built in code, class wired via config.delegateClass, no app-level UIMainStoryboardFile) with link opens forwarded to Capacitor; iOS 27 kills apps without complete scene-based startup in under a second, so never remove the scene setup.
