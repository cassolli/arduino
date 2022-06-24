#include <SoftwareSerial.h> //BLUETOOTH
#include <Wire.h>           //RFID
#include <SPI.h>            //RFID
#include <MFRC522.h>        //RFID, precisou ativar na IDE em tools>Library

#define SS_PIN 53 // pino sda rfid
#define RST_PIN 5 // pino reset rfid

const int VELOCIDADE = 9600;
int PIN_LEDS[4] = {8, 9, 12, 13}; // Array de leds
MFRC522 RFID(SS_PIN, RST_PIN);    // Passagem pinos para a biblioteca
SoftwareSerial BLUETOOTH(10, 11); // RX, TX ## Ligação invetida

String texto_recebido = "";              // String para tratar/criar os texto de comunicacao do bluetooth/serial arduino
unsigned long tempo_ultimo_caracter = 0; // Medida de tempo para delays

void setup()
{
  // RFID
  Wire.begin();
  SPI.begin();
  RFID.PCD_Init();
  // Comunicacao bluetooth
  BLUETOOTH.begin(VELOCIDADE);
  Serial.begin(VELOCIDADE);

  // Leds
  for (int i = 0; i < 4; i++)
  {
    pinMode(PIN_LEDS[i], OUTPUT);
  }
}

void manipulaLeds(int led = -1)
{
  if (led == -1)
    return;

  for (int i = 0; i < 4; i++)
  {
    digitalWrite(PIN_LEDS[i], led == i ? HIGH : LOW);
  }

  switch (led)
  {
  case 2:
    delay(1000);
    digitalWrite(PIN_LEDS[3], HIGH);
    delay(2000);
    digitalWrite(PIN_LEDS[3], LOW);
    break;

  case 3:
    delay(1000);
    digitalWrite(PIN_LEDS[2], HIGH);
    delay(2000);
    digitalWrite(PIN_LEDS[2], LOW);
    break;
  }
}

void enviaMaster()
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

void enviaSlave()
{
  if (!BLUETOOTH.available())
    return;

  char caracter = BLUETOOTH.read();

  manipulaLeds();

  switch (toupper(caracter))
  {
  case 'F':
    manipulaLeds(0);
    break;
  case 'T':
    manipulaLeds(1);
    break;

  case 'E':
    manipulaLeds(2);
    break;

  case 'D':
    manipulaLeds(3);
    break;
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
    manipulaLeds(0);
    BLUETOOTH.write("ANDANDO PARA FRENTE\n");
  }
  else
  {
    manipulaLeds(1);
    BLUETOOTH.write("ANDANDO PARA TRAS\n");
  }

  RFID.PICC_HaltA();      // Parar de ler o cartao
  RFID.PCD_StopCrypto1(); // parada da criptografia no pcd
}

void loop()
{
  leituraRFID();
  enviaMaster();
  enviaSlave();
}
