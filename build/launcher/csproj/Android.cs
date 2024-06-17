using System;
using System.IO;
using System.Diagnostics;
using System.ComponentModel;
using System.Reflection; // Adicionado para usar Assembly


namespace MyProcessSample {
    class MyProcess {
        public static void Main(string[] args) {
            // App Name
//            const string AppName = "Android";
          // Obter o caminho do executável atual
            string executablePath = Assembly.GetExecutingAssembly().Location;
            // Extrair o nome do arquivo sem extensão
            string AppName = Path.GetFileNameWithoutExtension(executablePath);
            try {
                using (Process myProcess = new Process()) {
                    myProcess.StartInfo.FileName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "main.bat");

                    // Adicionar AppName aos argumentos
                    string[] newArgs = new string[args.Length + 1];
                    newArgs[0] = "\"" + AppName + "\""; // Primeiro argumento é o AppName
                    for (int i = 0; i < args.Length; i++) {
                        newArgs[i + 1] = "\"" + args[i] + "\""; // Adiciona os argumentos existentes
                    }
                    myProcess.StartInfo.Arguments = String.Join(" ", newArgs);

                    // WorkingDirectory same as BaseDirectory
					myProcess.StartInfo.WorkingDirectory = AppDomain.CurrentDomain.BaseDirectory;

                    // Execute as administrator
//                    myProcess.StartInfo.Verb = "RunAs";

                    // Stop the process from opening a new window
                    myProcess.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;

                    myProcess.Start();
                }
            }
            catch (Exception e) {
                Console.WriteLine(e.Message);
            }
        }
    }
}
