#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "SPIFFS.h"
#include <ArduinoJson.h>
#include <WebServer.h>
#include <AutoConnect.h>

StaticJsonDocument<300> doc;

WebServer Server;
AutoConnect Portal(Server);
AutoConnectConfig Config;
AutoConnectAux auxUpload;

void rootPage()
{
  char content[] = "it works";
  Server.send(200, "text/plain", content);
}

Adafruit_BME280 bme; // I2C

const char* ssid     = "";                   //""; //name of your wifi
const char* password = "";                 //""; //pw of your wifi
#define SERVER_IP "192.168.178.30:4201"                                //"192.168.0.136:4201"

char *roomName;
char *transmissionFrequency;
char *postalCode;

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

void setup() {
  
  Serial.begin(9600);

  /*
  * -----------------------------------------------------------------------------
  *       Keep this code for debugging purposes
  *       to simulate "1st install" and wipe all stored credentials
  *       in the ESP32 flash memory
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
  
 
 // 0x76 and 0x77 are possible
 // bool communication = bme.begin();
 
  bool communication = bme.begin(0x76);
 
  if (!communication) {
  
   Serial.println("Could not find a valid BME280 sensor");
   Serial.println("check wiring, address, sensor ID!");
   Serial.print("SensorID was: 0x");
   Serial.println(bme.sensorID(), 16);
   Serial.println("ID of 0xFF probably means a bad address\n");
   
    while (true) { };
      delay(10);
    }
  else {
    Serial.println("Communication established!\n");
  }

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

    JsonArray arr = doc.to<JsonArray>();
    for (int i = 0; i <= 7; i++)
    {
      String s = file.readStringUntil('\n');
      arr.add(s);
    }

    //Fill variables from config file
    char a[50];
    char b[50];
    char c[50];
    strcpy(a, sanitizeStr(arr[1]));
    strcpy(b, sanitizeStr(arr[2]));
    strcpy(c, sanitizeStr(arr[3]));
    roomName = a;
    transmissionFrequency = b;
    postalCode = c;

    Server.on("/", rootPage);

    if (Portal.begin())
    {
      Serial.println("Wifi connected to esp gedingsel: " + WiFi.localIP().toString());
    }
 }

void loop() {

 //WIFI Autoconfig-Page
 Portal.handleClient();
  
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

 WiFiClient client;
  HTTPClient http;
  // wait for WiFi connection
  if ((WiFi.status() == WL_CONNECTED)) {
   

    Serial.print("[HTTP] begin...\n");
    // configure target server and url //error in this line > might be fixed by a running server
    http.begin(client, "http://" SERVER_IP"/v1/sensors/outdoor"); //HTTP
    http.addHeader("Content-Type", "application/json");


    Serial.print("[HTTP] POST...\n");
    // start connection and send HTTP header and body
    char buffer[200];
    
    char location[] = "hier";
    sprintf(buffer, "{\"humidity\":\"%.2f\",\"temperature\":\"%.2f\",\"pressure\":\"%.2f\",\"location\":\"%s\"}", bme.readHumidity(), bme.readTemperature(), bme.readPressure()/ 100.0F, location);
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
    delay(50000);
  }
}
