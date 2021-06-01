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

StaticJsonDocument<400> doc;

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

char *roomName = "-1";
char *transmissionFrequency = "-1";
char *postalCode = "-1";
char *id = "-1";

char *sanitizeStr(String s)
{
  char delimiter[] = "\"";
  char Buf[50];
  char *token;
  s.toCharArray(Buf, 50);
  token = strtok(Buf, delimiter);
  token = strtok(NULL, delimiter);
  //Serial.println("token");
  //Serial.println(token);
  return token;
}

void setup()
{

  Serial.begin(9600);

  // set up mq135
  Serial.println("The sensor is warming up...");
  delay(15000);
  pinMode(DIGITAL_PIN, INPUT);

  /*
    -----------------------------------------------------------------------------
          Keep this code for debugging purposes
          to simulate "1st install" and wipe all stored credentials
          in the ESP32 flash memory
  */

  //Erase flash memory ssid to force to use our config file
  //WiFi.mode(WIFI_STA);
  //delay(100);
  //WiFi.begin();
  //if (WiFi.waitForConnectResult() == WL_CONNECTED)
  //{
  //  WiFi.disconnect();
  //  while (WiFi.status() == WL_CONNECTED)
  //    delay(100);
  //}
  //Serial.println("Flash memory should be erased");

  // -----------------------------------------------------------------------------

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

  Serial.println("debug 1");

  // -------------------------------- Handle opening / reading of Config File ESPConfig.txt ------------------------------

  //Test filesystem access
  if (!SPIFFS.begin(true))
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  Serial.println("debug 2");

  File file = SPIFFS.open("/ESPconfig.txt");
  if (!file)
  {
    Serial.println("Failed to open file for reading");
    return;
  }

  Serial.println("debug 3");

  JsonArray arr = doc.to<JsonArray>();
  for (int i = 0; i <= 7; i++)
  {
    String s = file.readStringUntil('\n');
    arr.add(s);
  }

  Serial.println("debug 4");

  //Only print
  for (JsonVariant v : arr)
  {
     Serial.println(v.as<String>());
  }

  Serial.println("debug 5");

  //Fill variables from config file
  char a[50];
  char b[50];
  char c[50];
  char d[50];
  strcpy(a, sanitizeStr(arr[1]));
  strcpy(b, sanitizeStr(arr[2]));
  strcpy(c, sanitizeStr(arr[3]));
  strcpy(d, sanitizeStr(arr[4]));
  roomName = a;
  transmissionFrequency = b;
  postalCode = c;
  id = d;

  Serial.println("debug 5");
  Serial.println(roomName);
  Serial.println(transmissionFrequency);
  Serial.println(postalCode);
  Serial.println(id);

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

    char location[] = "hier";
    //sprintf(buffer, "{\"humidity\":\"%.2f\",\"temperature\":\"%.2f\",\"pressure\":\"%.2f\",\"gasVal\":\"%d\",\"location\":\"%s\"}", bme.readHumidity(), bme.readTemperature(), bme.readPressure() / 100.0F, gasVal, location);
    sprintf(buffer, "{\"humidity\":\"%.2f\",\"temperature\":\"%.2f\",\"deviceID\":\"%s\",\"gasVal\":\"%d\",\"location\":\"%s\"}", bme.readHumidity(), bme.readTemperature(), id, gasVal, postalCode);
    
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
      }
    }
    else
    {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
    file.close();
    delay(50000);
  }
}
