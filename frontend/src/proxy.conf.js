const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/auth",
            "/user",
            "/weather-data",
            "/pollen",
            "/espconfig",
        ],
        target: "http://localhost:4201/v1",
        secure: false,
        logLevel: "debug"
    }
]

module.exports = PROXY_CONFIG;