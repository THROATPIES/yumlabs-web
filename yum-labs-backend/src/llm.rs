use ollama_rs::Ollama;

use crate::{OLLAMA_HOST, OLLAMA_PORT};

pub fn initalize_ollama() -> Ollama {
    let command = std::process::Command::new("ollama")
        .arg("ps")
        .output()
        .expect("Failed to execute ollama ps command");

    // Convert the output to a string
    let details = String::from_utf8_lossy(&command.stdout);

    // Check if there's any output from the command
    if details.is_empty() {
        eprintln!("No output from 'ollama ps' command. Continuing without stopping a model...");
    } else {
        // Convert the details to a vector of lines
        let lines: Vec<&str> = details.lines().collect();

        // Find the line that contains the model name (assume it starts with a name-like string)
        if let Some(name_line) = lines
            .iter()
            .find(|&line| line.split_whitespace().count() > 0)
        {
            // Extract the first part of the line, which is the model name
            if let Some(model_name) = name_line.split_whitespace().next() {
                // Try to stop the model instance
                if let Err(e) = std::process::Command::new("ollama")
                    .arg("stop")
                    .arg(model_name)
                    .output()
                {
                    eprintln!("Failed to stop the model: {}. Continuing...", e);
                } else {
                    println!("Stopped model: {}", model_name);
                }
            } else {
                eprintln!("Failed to extract model name. Continuing without stopping a model...");
            }
        } else {
            eprintln!(
                "No valid model name found in the output. Continuing without stopping a model..."
            );
        }
    }

    println!("Starting New Ollama Instance");

    let ollama = Ollama::new(OLLAMA_HOST, OLLAMA_PORT);
    ollama
}
