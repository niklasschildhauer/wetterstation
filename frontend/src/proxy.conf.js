const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/auth",
            "/weather-data",
            "/pollen",
        ],
        target: "http://localhost:4201/v1",
        secure: false,
        logLevel: "debug"
    }
]

module.exports = PROXY_CONFIG;