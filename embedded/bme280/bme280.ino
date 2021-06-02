#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include "SPIFFS.h"
#include <ArduinoJson.h>
#include <WebServer.h>
#include <AutoConnect.h>
#include <AutoConnectCredential.h>

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

#define SERVER_IP "192.168.0.136:4201" //"192.168.0.136:4201"


void lightSleep(){
  Serial.println("light sleep");
  esp_sleep_enable_timer_wakeup(40000);
  esp_light_sleep_start();
}

String viewSSID() {
  AutoConnectCredential  ac(0);
  station_config_t  entry;
  String ssid = "";
  uint8_t  count = ac.entries();          // Get number of entries.

  for (int8_t i = 0; i < count; i++) {    // Loads all entries.
    ac.load(i, &entry);
    // Build a SSID line of an HTML.
    ssid = String((char *)entry.ssid); 
  }
  // Returns the '<li>SSID</li>' container.
  return ssid;
}

String viewPW() {
  AutoConnectCredential  ac(0);
  station_config_t  entry;
  String password = "";
  uint8_t  count = ac.entries();          // Get number of entries.

  for (int8_t i = 0; i < count; i++) {    // Loads all entries.
    ac.load(i, &entry);
    // Build a SSID line of an HTML.
    password = String((char *)entry.password);
   
  }
  // Returns the '<li>SSID</li>' container.
  return password;
}


/*-------------------------------setup----------------------------*/


void setup()
{
  Serial.begin(9600);

  Config.apid = "test";
  Config.psk = "12345678";
  

  // 0x76 and 0x77 are possible
  // bool communication = bme.begin();

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


  

  Server.on("/", rootPage);

}

/*------------------------------------loop---------------------------------*/

void loop()
{

  

//  AutoConnectCredential credential;
//  station_config_t config;
//  uint8_t ent = credential.entries();
//  uint8_t letsload = credential.load(ent, &config); 
//  Serial.printf("Delete for %s ", (char *)entry.ssid);
//  Serial.println(letsload); 
//  
  //Serial.println(credential);
//  Serial.println(viewCredential());


 
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

  const char *roomName = doc["roomName"].as<char *>();
  int transmissionFrequency = doc["transmissionFrequency"];
  const char *postalCode = doc["postalCode"].as<char *>();
  int id = doc["id"];
  const char *ssid = doc["ssid"].as<char *>();
  const char *password = doc["password"].as<char *>();

  
  Serial.println("lalalala");
  Serial.println(ssid);
  Serial.println(password);

  if((strcmp(password,"") == 1) && (strcmp(ssid,"") == 1)){
    Serial.println("Trying to connect to stored credentials");
    WiFi.begin(ssid, password);

   for (int i = 0; i < 10; i++)
    {
     if (WiFi.status() != WL_CONNECTED)
     {
       delay(1000);
       Serial.print(".");
     }
     else
     {
       continue;
     }
   }

   if (WiFi.status() == WL_CONNECTED)
   {
     Serial.println("");
     Serial.println("WiFi connected");
     Serial.println("IP address: ");
     Serial.println(WiFi.localIP());
   }
  }
    //------------------------------Autoconnect-----------------------------

  else{
    
      Serial.println("Trying to connect via auto connect");
     
      if (Portal.begin())
      {
        Serial.println("Wifi connected to esp gedingsel: " + WiFi.localIP().toString());
      }
      //WIFI Autoconfig-Page
      Portal.handleClient();
  }

  file.close();

  // -------------------------------- Http request/response handling ------------------------------

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
  if ((WiFi.status() == WL_CONNECTED))
  {

    Serial.print("[HTTP] begin...\n");
    // configure target server and url //error in this line > might be fixed by a running server
    http.begin(client, "http://" SERVER_IP "/v1/sensors/outdoor"); //HTTP
    http.addHeader("Content-Type", "application/json");

    Serial.print("[HTTP] POST...\n");
    // start connection and send HTTP header and body
    char buffer[220];

    sprintf(buffer, "{\"humidity\":\"%.2f\",\"temperature\":\"%.2f\",\"pressure\":\"%.2f\",\"deviceID\":\"%d\",\"location\":\"%s\"}", bme.readHumidity(), bme.readTemperature(), bme.readPressure() / 100.0F, id, postalCode);
    Serial.println(buffer);

    int httpCode = http.POST(buffer);

    // httpCode will be negative on error
    if (httpCode > 0)
    {
      // HTTP header has been send and Server response header has been handled
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      // file found at server
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

        // Parse JSON object
        DeserializationError error = deserializeJson(doc, payload);
        if (error)
        {
          Serial.print(F("deserializeJson() failed: "));
          Serial.println(error.f_str());
          return;
        }

        doc["ssid"] = viewSSID();
        
        doc["password"] = viewPW();
        
//        Serial.print(doc["ssid"]);
//        Serial.print(doc["password"]);
        serializeJson(doc, Serial);
        Serial.println(doc.as<String>());

     //   file.print(payload);
//        Serial.println("File written!");
//        Serial.println("==============================");
        file.close();
      }
    }
    else
    {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();

   //lightSleep();
    esp_sleep_enable_timer_wakeup(4000);
    Serial.println("Going to sleep now");
    Serial.flush(); 
    esp_deep_sleep_start();
    
    Serial.println("wake up again");
    
    //delay(50000);
    // delay(60000 * transmissionFrequency - 10000)
  }
}
