use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

// Define a struct to match the records structure in the database
#[derive(Deserialize, Serialize, Debug)] // Derive both Deserialize and Serialize
pub struct LlmRecord {
    id: Thing, // Use Thing for SurrealDB's complex ID
    instruction: String,
    prompt: String,
    response: String,
    model: Option<String>, // Model is optional, as it may not always be present
}

// Define query parameters structure to include limit and page
// #[derive(serde::Deserialize)]
// pub struct RecordsQueryParams {
//     limit: Option<usize>, // Number of records per page
//     page: Option<usize>,  // Page number
// }

// Struct to accept input from the client
#[derive(Deserialize)]
pub struct ChatRequest {
    pub model: String,
    pub temperature: String,
    pub top_p: String,
    pub top_k: String,
    pub content: String,
    pub prompt: String,
}

// Struct to return the AI response
#[derive(Serialize)]
pub struct ChatResponse {
    pub response: String,
}

#[derive(Deserialize, Serialize, Debug)] // Derive both Deserialize and Serialize
pub struct LlmInsert {
    pub instruction: String,
    pub prompt: String,
    pub response: String,
    pub model: Option<String>, // Model is optional, as it may not always be present
}

#[derive(Debug, Deserialize)]
pub struct Record {
    id: Thing,
    model: Option<String>,
}
