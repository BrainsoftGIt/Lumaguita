using System;
using System.Diagnostics;
using System.IO;

class Program
{
    static void Main(string[] args)
    {
        if (args.Length == 0)
        {
            Console.WriteLine("Uso: MeuPrograma <caminho-do-executável>");
            return;
        }

        string executablePath = args[0];

        // Configurar as informações de inicialização do processo
        ProcessStartInfo startInfo = new ProcessStartInfo
        {
            FileName = executablePath, // O comando que você deseja executar
            RedirectStandardOutput = true,
            UseShellExecute = false,
            CreateNoWindow = true,
            Verb = "runas" // Isso solicitará privilégios de administrador
        };

        // Criar o processo
        Process process = new Process { StartInfo = startInfo };

        // Manipular a saída do processo
        process.OutputDataReceived += (sender, e) =>
        {
            if (!string.IsNullOrEmpty(e.Data))
            {
                Console.WriteLine(e.Data);
            }
        };

        // Iniciar o processo
        process.Start();

        // Iniciar a leitura da saída do processo
        process.BeginOutputReadLine();

        // Aguardar o processo terminar
        process.WaitForExit();

        // Fechar o processo
        process.Close();

        Console.WriteLine("Pressione Enter para sair...");
        Console.ReadLine();
    }
}
