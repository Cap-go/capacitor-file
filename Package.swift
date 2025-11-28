// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapgoCapacitorFile",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "CapgoCapacitorFile",
            targets: ["CapacitorFilePlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "CapacitorFilePlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/CapacitorFilePlugin"),
        .testTarget(
            name: "CapacitorFilePluginTests",
            dependencies: ["CapacitorFilePlugin"],
            path: "ios/Tests/CapacitorFilePluginTests")
    ]
)
