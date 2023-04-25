import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
  BreakLine,
} from "node-thermal-printer";
import { asyncWrapper } from "./handlingTryCatchBlocks";

export const printThermal = asyncWrapper(async (data, printerType) => {
  let printer = new ThermalPrinter({
    type: PrinterTypes[printerType], // Printer type: 'star' or 'epson'
    interface: "tcp://xxx.xxx.xxx.xxx", // Printer interface
    // interface: 'printer:My Printer',
    characterSet: CharacterSet.SLOVENIA, // Printer character set - default: SLOVENIA
    removeSpecialCharacters: false, // Removes special characters - default: false
    lineCharacter: "-", // Set character for lines - default: "-"
    breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
    options: {
      // Additional options
      timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
    },
  });

  let isConnected = await printer.isPrinterConnected(); // Check if printer is connected, return bool of status
  
  if(isConnected){
    console.log("printer is connected");
    printer.println("OYMPIC HOTEL");  
    printer.println("TEL : 0783103500 / 0789677479");  
    printer.drawLine();                                         // Draws a line
    printer.bold(true);
    printer.println("**** BON DE COMMANDE / BAR");  
    printer.setTypeFontA();
    printer.drawLine();                                         // Draws a line
    printer.newLine();                                          // Insers break line
  
    printer.leftRight("Left", "Right");                         // Prints text left and right
    printer.table(["Item", "Qty", "Total"]);                     // Prints table equaly
    printer.tableCustom([                                       // Prints table with custom settings (text, align, width, cols, bold)
    { text:"Fanta", align:"LEFT", width:1 },
    { text:"1", align:"CENTER", width:1.5},
    { text:"1000", align:"RIGHT", cols:4 }
  ]);
    let execute = await printer.execute();
  }
  else{
    console.log( " Error: Printer not connected")
  }

});
