let waterLevel = 0
let sunlightLevel = 0
let soilHumidity = 0
ESP8266_IoT.initWIFI(SerialPin.P8, SerialPin.P12, BaudRate.BaudRate115200)
ESP8266_IoT.connectWifi("HKISIOT", "RoboTech567")
if (ESP8266_IoT.wifiState(true)) {
    basic.showIcon(IconNames.Yes)
} else {
    basic.showIcon(IconNames.No)
}
basic.forever(function () {
    while (true) {
        ESP8266_IoT.connectThingSpeak()
        basic.showIcon(IconNames.Happy)
        soilHumidity = Environment.ReadSoilHumidity(AnalogPin.P1)
        sunlightLevel = input.lightLevel()
        waterLevel = Environment.ReadWaterLevel(AnalogPin.P2)
        ESP8266_IoT.setData(
        "8J1228O8A6V2CF5Q",
        soilHumidity,
        sunlightLevel,
        input.temperature(),
        waterLevel
        )
        ESP8266_IoT.uploadData()
        basic.showIcon(IconNames.Square)
    }
})
