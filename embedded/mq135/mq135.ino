#define DIGITAL_PIN 2
#define ANALOG_PIN 0
uint16_t gasVal;
boolean isgas = false;
String gas;
void setup() {
 Serial.begin(9600);
 Serial.println("The sensor is warming up...");
 delay(30000);
 pinMode(DIGITAL_PIN, INPUT);
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
}
