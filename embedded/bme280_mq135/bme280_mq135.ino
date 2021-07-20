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
//#define RLOAD 22.0
#define RZERO 819
#include "MQ135.h"

WebServer Server;
AutoConnect Portal(Server);
AutoConnectConfig Config;
AutoConnectAux auxUpload;

//Pins für mq135 definieren
#define DIGITAL_PIN 33
#define ANALOG_PIN 35

MQ135 gasSensor = MQ135(35);

Adafruit_BME280 bme; //I2C

void rootPage()
{
  char content[] = "it works";
  Server.send(200, "text/plain", content);
}

#define SERVER_IP "192.168.0.136:4201" //"192.168.0.136:4201"

uint16_t gasVal;
boolean isgas = false;
String gas;
float ppm;

//Function to get access the memory of the autonnect credentials of the ESP and get the SSID
String viewSSID()
{
  AutoConnectCredential ac(0);
  station_config_t entry;
  String ssid = "";
  uint8_t count = ac.entries(); // Get number of entries.
  //Serial.println("ct");
  //Serial.println(count);

  for (int8_t i = 0; i < count; i++)
  { // Loads all entries.
    ac.load(i, &entry);
    // Build a SSID line of an HTML.
    ssid = String((char *)entry.ssid);
  }
  //Serial.println("ssid");
  //Serial.println(ssid);
  return ssid;
}

//Function to get access the memory of the autonnect credentials of the ESP and get the password
String viewPW()
{
  AutoConnectCredential ac(0);
  station_config_t entry;
  String password = "";
  uint8_t count = ac.entries(); // Get number of entries.
  //Serial.println("ct");
  //Serial.println(count);

  for (int8_t i = 0; i < count; i++)
  { // Loads all entries.
    ac.load(i, &entry);
    // Build a SSID line of an HTML.
    password = String((char *)entry.password);
  }
  //Serial.println("pwd");
  //Serial.println(password);
  return password;
}

/*-------------------------------setup----------------------------*/

void setup()
{
  Serial.begin(9600);

  Config.apid = "test";
  Config.psk = "12345678";

  // set up mq135
  Serial.println("The sensor is warming up...");
  delay(15000);
  pinMode(DIGITAL_PIN, INPUT);

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

  // Autoconnect config / default page
  Server.on("/", rootPage);
}

/*------------------------------------loop---------------------------------*/

void loop()
{
  // -------------------------------- Handle opening / reading of Config File ESPConfig.txt ------------------------------

  //Test filesystem access
  if (!SPIFFS.begin(true))
  {
    Serial.println("An Error has occurred while mounting SPIFFS");
    return;
  }

  //Open the config file ESPConfig.txt and read its contents
  File file = SPIFFS.open("/ESPconfig.txt", FILE_READ);
  if (!file)
  {
    Serial.println("Failed to open file for reading");
    return;
  }

  //Read the filecontent to JSON
  DynamicJsonDocument doc(600);

  // Parse the filecontent into the ArduinoJSON document
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

  //Save the fileContent values to variables
  const char *roomName = doc["roomName"].as<char *>();
  int transmissionFrequency = doc["transmissionFrequency"];
  const char *postalCode = doc["postalCode"].as<char *>();
  int id = doc["id"];
  const char *ssid = doc["ssid"].as<char *>();
  const char *password = doc["password"].as<char *>();

  //Serial.println(ssid);
  //Serial.println(password);

  //If credentials are stored in ESPConfig.txt connect to these credentials
  if ((strcmp("", password) != 0) && (strcmp("", ssid) != 0))
  {
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

  // If no credentials are stored use autoconnect library for the inital setup
  else
  {

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

  // mq135 Sensor auslesen
  gasVal = analogRead(ANALOG_PIN);
  isgas = digitalRead(DIGITAL_PIN);
  ppm = gasSensor.getPPM();
  if (isgas)
  {
    gas = "No";
  }
  else
  {
    gas = "Yes";
  }
  // Prints the collected values to Serial
  gasVal = map(gasVal, 0, 1023, 0, 100);
  Serial.print("Gas detected: ");
  Serial.println(gas);
  Serial.print("Gas percentage: ");
  Serial.print(gasVal);
  Serial.print("%\n");
  Serial.print("Gas ppm: ");
  Serial.print(ppm);
  Serial.print("\n");
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
        // The server "answer" is the current config in the database -> save this to ESPConfig.txt
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

        //Open ESPconfig.txt with WRITE permissions
        File file = SPIFFS.open("/ESPconfig.txt", FILE_WRITE);
        if (!file)
        {
          Serial.println("Failed to open file for writing");
          return;
        }

        // Parse JSON object out of the received payload
        DeserializationError error = deserializeJson(doc, payload);
        if (error)
        {
          Serial.print(F("deserializeJson() failed: "));
          Serial.println(error.f_str());
          return;
        }

        //Set the SSID and PW out of the credential memory into the text file
        doc["ssid"] = viewSSID();
        doc["password"] = viewPW();

        //Write payload + wifi credentials to the ESPconfig file
        file.print(doc.as<String>());
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
    //Set the delay timer for the Wifi board (default: 1min when transmissionFrequency = 1)
    delay(60000 * transmissionFrequency - 10000);
  }
}
