#include <SoftwareSerial.h> //BLUETOOTH
#include <Wire.h>           //RFID
#include <SPI.h>            //RFID 
#include <MFRC522.h>        //RFID, precisou ativar na IDE em tools>Library

#define SS_PIN 53 //pino sda rfid
#define RST_PIN 5 //pino reset rfid
 
MFRC522 rfid(SS_PIN, RST_PIN); //Passagem pinos para a biblioteca             

SoftwareSerial bluetooth(10, 11); // RX, TX ## Ligação invetida
int pinPortas[4] = {8,9,12,13};   //Array de leds
String textoRecebido = "";        //String para tratar/criar os texto de comunicacao do bluetooth/serial arduino
unsigned long delay1 = 0;         //Medida de tempo para delays
char caracter;                    //Variavel para armazenar cada caractere recebido na serial

void setup() {
  //RFID
  Wire.begin(); 
  SPI.begin();
  rfid.PCD_Init();
  //Comunicacao bluetooth
  bluetooth.begin(9600);
  Serial.begin(9600);
  //Leds
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

void enviaMaster(){
  if (Serial.available()) {
    caracter = Serial.read();
    textoRecebido += caracter;
    delay1 = millis();
  }

  if (((millis() - delay1) > 10) && (textoRecebido != "")) {
     bluetooth.print(textoRecebido);
     textoRecebido = "";
  }
}

void enviaSlave(){
    if (bluetooth.available()) {
        caracter = bluetooth.read();
        caracter = toupper(caracter);
        manipulaLed(9); //Para desligar todos os leds
     
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

void leituraRfid(){
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial())
    return;
 
  String strID = ""; 
  for (byte i = 0; i < 4; i++) {
    strID +=
    (rfid.uid.uidByte[i] < 0x10 ? "0" : "") +
    String(rfid.uid.uidByte[i], HEX) +
    (i!=3 ? ":" : "");
  }
  strID.toUpperCase();
  if (strID.indexOf("01:4F:77:89") >= 0) {
      manipulaLed(0);
      bluetooth.write("ANDANDO PARA FRENTE\n");  
  }else{ 
      manipulaLed(1);
      bluetooth.write("ANDANDO PARA TRAS\n");  
  }
  rfid.PICC_HaltA(); //Parar de ler o cartao
  rfid.PCD_StopCrypto1(); //parada da criptografia no pcd
  }


void loop() {
  leituraRfid();
  enviaMaster();
  enviaSlave();
}