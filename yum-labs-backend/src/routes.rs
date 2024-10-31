use std::sync::Arc;

use actix_web::{get, post, web, HttpResponse, Responder};
use ollama_rs::generation::chat::request::ChatMessageRequest;
use ollama_rs::generation::chat::ChatMessage;
use ollama_rs::generation::options::GenerationOptions;
use ollama_rs::Ollama;
use surrealdb::engine::remote::ws::Client;
use surrealdb::Surreal;

use crate::{ChatRequest, ChatResponse, LlmInsert, LlmRecord, Record, DEFAULT_PROMPTS};

#[post("/api/chat")]
async fn chat(
    ollama: web::Data<Arc<Ollama>>,
    req_body: web::Json<ChatRequest>,
    client: web::Data<Surreal<Client>>,
) -> impl Responder {
    let options = GenerationOptions::default()
        .temperature(req_body.temperature.parse::<f32>().unwrap())
        .repeat_penalty(1.3)
        .top_k(req_body.top_k.parse::<f32>().unwrap() as i32 as u32)
        .top_p(req_body.top_p.parse::<f32>().unwrap());

    if req_body.model.contains("llama")
        || req_body.model.contains("gemma")
        || req_body.model.contains("smollm")
    {
        let message = ChatMessageRequest::new(
            req_body.model.clone(),
            vec![ChatMessage::user(req_body.prompt.clone())],
        )
        .options(options);

        let response = ollama.send_chat_messages(message).await.unwrap();
        let created: Option<Record> = client
            .create("large_language_models")
            .content(LlmInsert {
                instruction: req_body.content.clone(),
                prompt: req_body.prompt.clone(),
                response: response.clone().message.unwrap().content.clone(),
                model: Some(req_body.model.clone()),
            })
            .await
            .unwrap();
        dbg!(created);
        HttpResponse::Ok().json(ChatResponse {
            response: response.message.unwrap().content,
        })
    } else {
        let message = ChatMessageRequest::new(
            req_body.model.clone(),
            vec![
                ChatMessage::user(req_body.prompt.clone()),
                ChatMessage::system(req_body.content.clone()),
            ],
        )
        .options(options);

        let response = ollama.send_chat_messages(message).await.unwrap();

        let created: Option<Record> = client
            .create("large_language_models")
            .content(LlmInsert {
                instruction: req_body.content.clone(),
                prompt: req_body.prompt.clone(),
                response: response.clone().message.unwrap().content.clone(),
                model: Some(req_body.model.clone()),
            })
            .await
            .unwrap();
        dbg!(created);

        HttpResponse::Ok().json(ChatResponse {
            response: response.message.unwrap().content,
        })
    }
}

#[get("/")]
async fn landing() -> impl Responder {
    HttpResponse::Ok().body("Yumlabs Webserver!")
}

#[get("/all_available_models")]
async fn all_available_models(ollama: web::Data<Arc<Ollama>>) -> impl Responder {
    let models = ollama.list_local_models().await.unwrap_or_else(|err| {
        println!("Failed to list models: {}", err);

        Vec::new()
    });

    let mut found_models = Vec::new();
    for model in models {
        found_models.push(model.name);
    }

    HttpResponse::Ok().json(found_models)
}

#[get("/all_default_prompts")]
async fn all_default_prompts() -> impl Responder {
    HttpResponse::Ok().json(DEFAULT_PROMPTS)
}

#[get("/all_llm_records")]
async fn all_llm_records(db: web::Data<Surreal<Client>>) -> impl Responder {
    let query_string = "SELECT * FROM large_language_models";

    // Query the database and handle the response
    match db.query(query_string).await {
        Ok(mut res) => {
            // Get the results from the query
            let records: Result<Vec<LlmRecord>, _> = res.take(0); // Expecting an array of LlmRecord

            match records {
                Ok(records) => HttpResponse::Ok().json(records), // Return the records as JSON
                Err(err) => {
                    println!("Deserialization error: {:?}", err);
                    HttpResponse::InternalServerError().body("Failed to retrieve records")
                }
            }
        }
        Err(err) => {
            println!("Query execution error: {:?}", err);
            HttpResponse::InternalServerError().body(format!("Error: {:?}", err))
            // Handle errors
        }
    }
}
