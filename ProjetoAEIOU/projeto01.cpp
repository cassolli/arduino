#include <SoftwareSerial.h>

SoftwareSerial bluetooth(10, 11); // RX, TX
int pinPortas[4] = {8,9,12,13};  //Leds
String textoRecebido = "";
unsigned long delay1 = 0;

void setup() {

  bluetooth.begin(9600);
  Serial.begin(9600);
  for(int i=0; i<4; i++){
    pinMode(pinPortas[i], OUTPUT);
  }

}

void manipulaLed(int led){
  for(int i=0; i < 4; i++){
    if(i == led){
      digitalWrite(pinPortas[i], HIGH);
    }
    else{
      digitalWrite(pinPortas[i], LOW);
    }
  }
  if(led == 2){
        delay(1000);
        digitalWrite(pinPortas[3], HIGH);
        delay(2000);
        digitalWrite(pinPortas[3], LOW);
  }

  if(led == 3){
        delay(1000);
        digitalWrite(pinPortas[2], HIGH);
        delay(2000);
        digitalWrite(pinPortas[2], LOW);
  }
}

void loop() {
  char caracter;
  
  if (Serial.available()) {
     caracter = Serial.read();
     textoRecebido += caracter;
     delay1 = millis();
  }

  if (((millis() - delay1) > 10) && (textoRecebido != "")) {
     bluetooth.print(textoRecebido);   
     textoRecebido = "";
  }

  if (bluetooth.available()) {
     caracter = bluetooth.read();
     caracter = toupper(caracter);
     manipulaLed(caracter);
     if(caracter == 'F'){
      manipulaLed(0);
     }
     if(caracter == 'T'){
       manipulaLed(1);
     }
       if(caracter == 'E'){
       manipulaLed(2);
     }
       if(caracter == 'D'){
       manipulaLed(3);
     }
     Serial.print(caracter);  
  }
  
}