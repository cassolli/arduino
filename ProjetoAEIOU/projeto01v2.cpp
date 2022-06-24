#include <SoftwareSerial.h> //BLUETOOTH
#include <Wire.h>           //RFID
#include <SPI.h>            //RFID
#include <MFRC522.h>        //RFID, precisou ativar na IDE em tools>Library

#define SS_PIN 53 // pino sda rfid
#define RST_PIN 2 // pino reset rfid

const int VELOCIDADE = 9600;
MFRC522 RFID(SS_PIN, RST_PIN);    // Passagem pinos para a biblioteca
SoftwareSerial BLUETOOTH(10, 11); // RX, TX ## Ligação invetida

String texto_recebido = "";              // String para tratar/criar os texto de comunicacao do bluetooth/serial arduino
unsigned long tempo_ultimo_caracter = 0; // Medida de tempo para delays

//movimentação
#define dirFrente 4
#define dirTras   3
#define esqFrente 9
#define esqTras   6

// DEFINIÇÕES
#define FRENTE 1
#define PARADO 0
#define TRAS  -1

#define velocidadeE 200
#define velocidadeD 210

void setup()
{
  // RFID
  Wire.begin();
  SPI.begin();
  RFID.PCD_Init();
  // Comunicacao bluetooth
  BLUETOOTH.begin(VELOCIDADE);
  Serial.begin(VELOCIDADE);
    // CONFIGURAÇÃO DOS PINOS DA PONTE-H
  pinMode(dirFrente, OUTPUT);
  pinMode(dirTras,   OUTPUT);
  pinMode(esqFrente, OUTPUT);
  pinMode(esqTras,   OUTPUT);

  // DEIXANDO OS MOTORES PARADOS
  digitalWrite(dirFrente, LOW);
  digitalWrite(dirTras,   LOW);
  digitalWrite(esqFrente, LOW);
  digitalWrite(esqTras,   LOW);

}

void enviaCelular()
{
  if (!Serial.available())
    return;

  unsigned long tempo_caracter_atual = millis();
  texto_recebido += Serial.read();

  if ((tempo_caracter_atual - tempo_ultimo_caracter) > 10 && texto_recebido != "")
  {
    BLUETOOTH.print(texto_recebido);
    texto_recebido = "";
  }

  tempo_ultimo_caracter = tempo_caracter_atual;
}

void enviaRobo()
{
  if (!BLUETOOTH.available())
    return;

  char caracter = BLUETOOTH.read();

  if (toupper(caracter) == 'F') { // ANDAR PRA FRENTE
    // MOTOR DIREITO PARA FRENTE
    analogWrite(dirFrente,  velocidadeD);
    analogWrite(dirTras,    LOW);

    // MOTOR ESQUERDO PARA FRENTE
    analogWrite(esqFrente,  velocidadeE);
    analogWrite(esqTras,    LOW);

  } else if (toupper(caracter) == 'D') { // VIRAR PRA DIREITA
    // MOTOR DIREITO PARA TRAS
    analogWrite(dirFrente,  LOW);
    analogWrite(dirTras,    velocidadeD);

    // MOTOR ESQUERDO PARA FRENTE
    analogWrite(esqFrente,  velocidadeE);
    analogWrite(esqTras,    LOW);

  } else if (toupper(caracter) == 'E') { // VIRAR PRA ESQUERDA
    // MOTOR DIREITO PARA FRENTE
    analogWrite(dirFrente,  velocidadeD);
    analogWrite(dirTras,    LOW);

    // MOTOR ESQUERDO PARA TRAS
    analogWrite(esqFrente,  LOW);
    analogWrite(esqTras,    velocidadeE);

  } else if (toupper(caracter) == 'T') { // ANDAR PRA TRAS
    // MOTOR DIREITO PARA TRAS
    analogWrite(dirFrente,  LOW);
    analogWrite(dirTras,    velocidadeE);

    // MOTOR ESQUERDO PARA TRAS
    analogWrite(esqFrente,  LOW);
    analogWrite(esqTras,    velocidadeD);

  } else { // FICAR PARADO
    digitalWrite(dirFrente, LOW);
    digitalWrite(dirTras,   LOW);
    digitalWrite(esqFrente, LOW);
    digitalWrite(esqTras,   LOW);
  }


  Serial.print(caracter);
}

void leituraRFID()
{
  if (!RFID.PICC_IsNewCardPresent() || !RFID.PICC_ReadCardSerial())
    return;

  String id_dispositivo = "";
  for (byte i = 0; i < 4; i++)
  {
    id_dispositivo += RFID.uid.uidByte[i] < 0x10 ? "0" : "";
    id_dispositivo += String(RFID.uid.uidByte[i], HEX);
    id_dispositivo += i != 3 ? ":" : "";
  }
  id_dispositivo.toUpperCase();

  if (id_dispositivo.indexOf("01:4F:77:89") >= 0)
  {
    BLUETOOTH.write("ACHEI A\n");
  } else if (id_dispositivo.indexOf("43:81:5C:A") >= 0)
  {
    BLUETOOTH.write("ACHEI E\n");
  }else if (id_dispositivo.indexOf("33:A2:CC:06") >= 0)
  {
    BLUETOOTH.write("ACHEI I\n");
  }else if (id_dispositivo.indexOf("49:E7:7D:39") >= 0)
  {
    BLUETOOTH.write("ACHEI O\n");
  }else if (id_dispositivo.indexOf("A3:C7:4B:A7") >= 0)
  {
    BLUETOOTH.write("ACHEI U\n");
  }else
  {
    BLUETOOTH.write("CARTÃO NÃO CADASTRADO\n");
  }

  RFID.PICC_HaltA();      // Parar de ler o cartao
  RFID.PCD_StopCrypto1(); // parada da criptografia no pcd
}

void loop()
{
  leituraRFID();
  enviaCelular();
  enviaRobo();
}