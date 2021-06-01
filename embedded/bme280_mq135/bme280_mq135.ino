#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "SPIFFS.h"
#include <ArduinoJson.h>
#include <WebServer.h>
#include <AutoConnect.h>

//Pins für mq135 definieren
#define DIGITAL_PIN 33
#define ANALOG_PIN 35

// I2C für bme
Adafruit_BME280 bme;

WebServer Server;
AutoConnect Portal(Server);
AutoConnectConfig Config;
AutoConnectAux auxUpload;

void rootPage()
{
  char content[] = "it works";
  Server.send(200, "text/plain", content);
}

char *ssid = "";                        // "";
char *password = "";                    //""; //pw of your wifi
#define SERVER_IP "192.168.178.30:4201" //"192.168.0.136:4201"

uint16_t gasVal;
boolean isgas = false;
String gas;

void setup()
{

  Serial.begin(9600);

  // set up mq135
  Serial.println("The sensor is warming up...");
  delay(15000);
  pinMode(DIGITAL_PIN, INPUT);

  //Config.autoReconnect=true;
  //Config.hostName = 'esp32-01';
  //Portal.Config(Config);

  // 0x76 and 0x77 are possible for bme280
  bool communication = bme.begin(0x76);

  if (!communication)
  {

    Serial.println("Could not find a valid BME280 sensor");
    Serial.println("check wiring, address, sensor ID!");
    Serial.print("SensorID was: 0x");
    Serial.println(bme.sensorID(), 16);
    Serial.println("ID of 0xFF probably means a bad address\n");

    while (true)
    {
    };
    delay(10);
  }
  else
  {
    Serial.println("Communication established!\n");
  }

  // Connecting to a WiFi network
  // Serial.println();
  // Serial.println();
  // Serial.print("Connecting to ");
  // Serial.println(ssid);

  // WiFi.begin(ssid, password);

  // for (int i = 0; i < 10; i++)
  // {
  //   if (WiFi.status() != WL_CONNECTED)
  //   {
  //     delay(1000);
  //     Serial.print(".");
  //   }
  //   else
  //   {
  //     continue;
  //   }
  // }

  // if (WiFi.status() == WL_CONNECTED)
  // {
  //   Serial.println("");
  //   Serial.println("WiFi connected");
  //   Serial.println("IP address: ");
  //   Serial.println(WiFi.localIP());
  // }

  Server.on("/", rootPage);

  if (Portal.begin())
  {
    Serial.println("Wifi connected to esp gedingsel: " + WiFi.localIP().toString());
  }
}

void loop()
{
  //WIFI Autoconfig-Page
  Portal.handleClient();

  // -------------------------------- Handle opening / reading of Config File ESPConfig.txt ------------------------------

  //Test filesystem access
  if (!SPIFFS.begin(true))
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  File file = SPIFFS.open("/ESPconfig.txt");
  if (!file)
  {
    Serial.println("Failed to open file for reading");
    return;
  }

  DynamicJsonDocument doc(600);

  String str;
  Serial.println("File content");
  while (file.available())
  {
    str = file.readString();
    Serial.println(str);
  }

  // Parse JSON object
  DeserializationError error = deserializeJson(doc, str);
  if (error)
  {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  //char* roomName = "raum";
  //int transmissionFrequency = 10;
  //char* postalCode = "-1";
  //int id = -1;

  //roomName = doc["roomName"];
  int transmissionFrequency = doc["transmissionFrequency"];
  const char *postalCode = doc["postalCode"].as<char *>();
  int id = doc["id"];

  file.close();

  // bme280 Sensor auslesen
  Serial.print("Temperature = ");
  Serial.print(bme.readTemperature());
  Serial.println(" *C");
  Serial.print("Pressure = ");
  Serial.print(bme.readPressure() / 100.0F);
  Serial.println(" hPa");
  Serial.print("Humidity = ");
  Serial.print(bme.readHumidity());
  Serial.println(" %\n");
  delay(1000);

  // mq135 Sensor auslesen
  gasVal = analogRead(ANALOG_PIN);
  isgas = digitalRead(DIGITAL_PIN);
  if (isgas)
  {
    gas = "No";
  }
  else
  {
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
  if ((WiFi.status() == WL_CONNECTED))
  {

    Serial.print("[HTTP] begin...\n");
    // configure target server and url //error in this line > might be fixed by a running server
    http.begin(client, "http://" SERVER_IP "/v1/sensors/indoor"); //HTTP
    http.addHeader("Content-Type", "application/json");

    Serial.print("[HTTP] POST...\n");
    // start connection and send HTTP header and body
    char buffer[300];

    sprintf(buffer, "{\"humidity\":\"%.2f\",\"temperature\":\"%.2f\",\"deviceID\":\"%d\",\"gasVal\":\"%d\",\"location\":\"%s\"}", bme.readHumidity(), bme.readTemperature(), id, gasVal, postalCode);

    Serial.println(buffer);
    int httpCode = http.POST(buffer);

    // httpCode will be negative on error
    if (httpCode > 0)
    {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      // resource found at server
      if (httpCode == HTTP_CODE_OK)
      {
        const String &payload = http.getString();
        Serial.println("received payload:\n<<");
        Serial.println(payload);
        Serial.println(">>");

        //Test filesystem access
        if (!SPIFFS.begin(true))
        {
          Serial.println("An Error has occurred while mounting SPIFFS");
          return;
        }

        File file = SPIFFS.open("/ESPconfig.txt", FILE_WRITE);
        if (!file)
        {
          Serial.println("Failed to open file for writing");
          return;
        }

        file.print(payload);
        Serial.println("File written!");
        Serial.println("==============================");
        file.close();
      }
    }
    else
    {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
    delay(50000);
    // delay(60000 * transmissionFrequency - 10000)
  }
}
