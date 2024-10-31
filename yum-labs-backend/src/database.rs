use surrealdb::engine::remote::ws::{ Client, Ws };
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;

use crate::{
    DATABASE_NAME,
    DATABASE_NAMESPACE,
    DATABASE_PASSWORD,
    DATABASE_SERVER_ADDRESS,
    DATABASE_USER,
};

pub async fn initalize_database() -> Surreal<Client> {
    // Connect to the server
    let db = Surreal::new::<Ws>(DATABASE_SERVER_ADDRESS).await.unwrap_or_else(|err| {
        println!("Error connecting to database: {}", err);
        std::process::exit(1);
    });

    // Signin as a namespace, database, or root user
    db.signin(Root {
        username: DATABASE_USER,
        password: DATABASE_PASSWORD,
    }).await.unwrap_or_else(|err| {
        println!("Error signing in to database: {}", err);
        std::process::exit(1);
    });

    // Select a specific namespace / database
    db.use_ns(DATABASE_NAMESPACE)
        .use_db(DATABASE_NAME).await
        .unwrap_or_else(|err| {
            println!("Error selecting database: {}", err);
            std::process::exit(1);
        });

    db
}
