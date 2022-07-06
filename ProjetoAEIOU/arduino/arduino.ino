#include <SoftwareSerial.h>  //BLUETOOTH
#include <Wire.h>            //RFID
#include <SPI.h>             //RFID
#include <MFRC522.h>         //RFID, precisou ativar na IDE em tools>Library
#include<string.h>

const int ARDUINO_VELOCIDADE = 9600;       // Velocidade de operação arduino
const int RFID_CHIP_SELECT_PIN = 53;       // RFID pino sda
const int RFID_RESET_POWER_DOWN_PIN = 47;  // RFID pino reset
const int BLUETOOTH_RX_PIN = 10;           // Bluetooth pino RX (receive)
const int BLUETOOTH_TX_PIN = 11;           // Bluetooth pino TX (transmit)

const int DIRECAO_FRENTE_DIREITA_PIN = 13;
const int DIRECAO_FRENTE_ESQUERDA_PIN = 9;
const int DIRECAO_TRAS_DIREITA_PIN = 12;
const int DIRECAO_TRAS_ESQUERDA_PIN = 8;

const int VELOCIDADE_RODA_ESQUERDA = 180;  // MAX 255
const int VELOCIDADE_RODA_DIREITA = 180;   // MAX 255

MFRC522 RFID(RFID_CHIP_SELECT_PIN, RFID_RESET_POWER_DOWN_PIN);  // Passagem pinos para a biblioteca
SoftwareSerial BLUETOOTH(BLUETOOTH_RX_PIN, BLUETOOTH_TX_PIN);   // RX, TX ## Ligação invetida

String texto_recebido = "";               // String para tratar/criar os texto de comunicacao do bluetooth/serial arduino
unsigned long tempo_ultimo_caracter = 0;  // Medida de tempo para delays

void moverRobo(int frente_direita = LOW, int frente_esquerda = LOW, int tras_direita = LOW, int tras_esquerda = LOW) {
  Serial.println("\n--MOVIMENTO");
  Serial.print("frente_direita: ");
  Serial.print(frente_direita);
  Serial.print("\nfrente_esquerda: ");
  Serial.print(frente_esquerda);
  Serial.print("\ntras_direita: ");
  Serial.print(tras_direita);
  Serial.print("\ntras_esquerda: ");
  Serial.print(tras_esquerda);
  Serial.println("\n--FIM MOVIMENTO--");

  analogWrite(DIRECAO_FRENTE_DIREITA_PIN, frente_direita);
  analogWrite(DIRECAO_FRENTE_ESQUERDA_PIN, frente_esquerda);
  analogWrite(DIRECAO_TRAS_DIREITA_PIN, tras_direita);
  analogWrite(DIRECAO_TRAS_ESQUERDA_PIN, tras_esquerda);
}

void setup() {
  // RFID
  Wire.begin();
  SPI.begin();
  RFID.PCD_Init();

  // Comunicacao bluetooth
  BLUETOOTH.begin(ARDUINO_VELOCIDADE);
  Serial.begin(ARDUINO_VELOCIDADE);

  // CONFIGURAÇÃO DOS PINOS DA PONTE-H
  pinMode(DIRECAO_FRENTE_DIREITA_PIN, OUTPUT);
  pinMode(DIRECAO_FRENTE_ESQUERDA_PIN, OUTPUT);
  pinMode(DIRECAO_TRAS_DIREITA_PIN, OUTPUT);
  pinMode(DIRECAO_TRAS_ESQUERDA_PIN, OUTPUT);

  // DEIXANDO OS MOTORES PARADOS
  moverRobo();
}

void enviarBluetooth() {
  if (!Serial.available())
    return;

  unsigned long tempo_caracter_atual = millis();
  texto_recebido += Serial.read();

  if ((tempo_caracter_atual - tempo_ultimo_caracter) > 10 && texto_recebido != "") {
    BLUETOOTH.println(texto_recebido);
    texto_recebido = "";
  }

  tempo_ultimo_caracter = tempo_caracter_atual;
}

void lerBluetooth() {
  if (!BLUETOOTH.available())
    return;

  char caracter = BLUETOOTH.read();

  if (strcmp(caracter, '6') || caracter == 6 || caracter == '6') {
    Serial.print("== PODE ESCREVER\n");
    // BLUETOOTH.write("2");
    BLUETOOTH.println("Teste 12");
  }

  Serial.print("== CARACTER:  ");
  Serial.print(caracter);

  switch (toupper(caracter)) {
    case 'F':  // ANDAR PRA FRENTE
      moverRobo(VELOCIDADE_RODA_DIREITA, VELOCIDADE_RODA_ESQUERDA);
      break;
    case 'D':  // VIRAR PRA DIREITA
      moverRobo(LOW, VELOCIDADE_RODA_DIREITA, VELOCIDADE_RODA_ESQUERDA, LOW);
      break;
    case 'E':  // VIRAR PRA ESQUERDA
      moverRobo(VELOCIDADE_RODA_DIREITA, LOW, LOW, VELOCIDADE_RODA_ESQUERDA);
      break;
    case 'T':  // ANDAR PRA TRAS
      moverRobo(LOW, LOW, VELOCIDADE_RODA_DIREITA, VELOCIDADE_RODA_ESQUERDA);
      break;
    default:  // PARADO
      moverRobo();
      break;
  }

  delay(200);
  moverRobo();

  Serial.println(caracter);
}

void lerRFID() {
  if (!RFID.PICC_IsNewCardPresent() || !RFID.PICC_ReadCardSerial())
    return;

  moverRobo();

  String id_dispositivo = "";
  for (byte i = 0; i < 4; i++) {
    id_dispositivo += RFID.uid.uidByte[i] < 0x10 ? "0" : "";
    id_dispositivo += String(RFID.uid.uidByte[i], HEX);
    id_dispositivo += i != 3 ? ":" : "";
  }
  id_dispositivo.toUpperCase();

  if (id_dispositivo.indexOf("01:4F:77:89") >= 0) {
    BLUETOOTH.write("ACHEI A\n");
  } else if (id_dispositivo.indexOf("43:81:5C:A") >= 0) {
    BLUETOOTH.write("ACHEI E\n");
  } else if (id_dispositivo.indexOf("33:A2:CC:06") >= 0) {
    BLUETOOTH.write("ACHEI I\n");
  } else if (id_dispositivo.indexOf("49:E7:7D:39") >= 0) {
    BLUETOOTH.write("ACHEI O\n");
  } else if (id_dispositivo.indexOf("A3:C7:4B:A7") >= 0) {
    BLUETOOTH.write("ACHEI U\n");
  } else {
    BLUETOOTH.write("CARTÃO NÃO CADASTRADO\n");
  }

  RFID.PICC_HaltA();       // Parar de ler o cartao
  RFID.PCD_StopCrypto1();  // parada da criptografia no pcd
}

void loop() {
  lerRFID();
  enviarBluetooth();
  lerBluetooth();
}