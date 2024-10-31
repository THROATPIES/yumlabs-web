use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use ollama_rs::Ollama;
use std::sync::Arc;

mod routes;
use routes::*;
mod constants;
use constants::*;
mod database;
use database::*;
mod llm;
use llm::*; // Assuming this contains the Ollama struct and related functions
mod structs;
use structs::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let db = initalize_database().await;

    // Initialize Ollama only once
    let ollama_instance: Ollama = initalize_ollama();
    let ollama_data = web::Data::new(Arc::new(ollama_instance)); // Wrap it in Arc for safe sharing

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(db.clone())) // Share database connection
            .app_data(ollama_data.clone()) // Share Ollama instance
            .wrap(
                Cors::default()
                    .allowed_origin(FRONTEND_HOST_ADDRESS)
                    .allow_any_header() // Allow all headers
                    .allow_any_method(), // Allow all methods (GET, POST, etc.)
            )
            .service(landing) // Your landing route
            .service(all_llm_records) // Route for retrieving all LLM records
            .service(all_available_models)
            .service(all_default_prompts)
            .service(chat) // Ensure the chat route has access to the Ollama instance
    })
    .bind((ACTIX_SERVER_ADDRESS, ACTIX_SERVER_PORT))?
    .run()
    .await
}
