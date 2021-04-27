#include<WiFi.h>
#include<HTTPClient.h>

//pins für mq135 definieren
#define DIGITAL_PIN 33
#define ANALOG_PIN 35

const char* ssid     = "Vodafone-1F7F"; //name of your wifi
const char* password = "ABbpgU3aGaNmedUm"; //pw of your wifi
const char* server_ip = "127.0.0.1:2019"; //add server ip and port

uint16_t gasVal;
boolean isgas = false;
String gas;

void setup() {
  Serial.begin(9600);

  Serial.println("The sensor is warming up...");
  delay(30000);
  pinMode(DIGITAL_PIN, INPUT);

  // We start by connecting to a WiFi network

    Serial.println();
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);

    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    WiFiClient client;
    HTTPClient http;
}

void loop() {
  gasVal = analogRead(ANALOG_PIN);
  isgas = digitalRead(DIGITAL_PIN);
  if (isgas) {
    gas = "No";
  }
  else {
    gas = "Yes";
  }
  gasVal = map(gasVal, 0, 1023, 0, 100);
  Serial.print("Gas detected: ");
  Serial.println(gas);
  Serial.print("Gas percentage: ");
  Serial.print(gasVal);
  Serial.print("%\n");
  delay(2000);

  WiFiClient client;
  HTTPClient http;
  // wait for WiFi connection
  if ((WiFi.status() == WL_CONNECTED)) {
   

    Serial.print("[HTTP] begin...\n");
    // configure target server and url
    http.begin(client, "http://"server_ip"/mqdata"); //HTTP //error in this line > might be fixed by a running server
    http.addHeader("Content-Type", "application/json");


    Serial.print("[HTTP] POST...\n");
    // start connection and send HTTP header and body
    char buffer[200];

    sprintf(buffer, "{\"air quality\":\"%d\"}", gasVal);
    Serial.println(buffer);
    int httpCode = http.POST(buffer);
   
    // httpCode will be negative on error
    if (httpCode > 0) {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      // file found at server
      if (httpCode == HTTP_CODE_OK) {
        const String& payload = http.getString();
        Serial.println("received payload:\n<<");
        Serial.println(payload);
        Serial.println(">>");    
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  }
}
