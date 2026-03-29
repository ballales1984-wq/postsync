fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            generate_post,
            generate_from_url,
            save_post,
            get_posts,
            delete_post,
            save_api_key,
            get_api_key,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn generate_post(
    topic: String,
    platform: String,
    api_key: String,
    template: Option<String>,
) -> Result<String, String> {
    let client = reqwest::Client::new();

    let system_prompt = format!(
        "Sei un esperto di social media marketing. Scrivi un post per {} in italiano. NON usare markdown.",
        platform
    );

    let body = serde_json::json!({
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": format!("Tema: {}", topic)}
        ],
        "max_tokens": 500,
        "temperature": 0.8
    });

    // Try Groq first
    if !api_key.is_empty() {
        let resp = client
            .post("https://api.groq.com/openai/v1/chat/completions")
            .header("Authorization", format!("Bearer {}", api_key))
            .header("Content-Type", "application/json")
            .json(&body)
            .send()
            .await
            .map_err(|e| e.to_string())?;

        if resp.status().is_success() {
            let data: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
            let content = data["choices"][0]["message"]["content"]
                .as_str()
                .unwrap_or("")
                .to_string();
            return Ok(content);
        }
    }

    // Fallback to Ollama
    let ollama_body = serde_json::json!({
        "model": "llama3",
        "system": system_prompt,
        "prompt": format!("Tema: {}", topic),
        "stream": false
    });

    let resp = client
        .post("http://localhost:11434/api/generate")
        .header("Content-Type", "application/json")
        .json(&ollama_body)
        .send()
        .await
        .map_err(|e| format!("Ollama non disponibile: {}", e))?;

    if resp.status().is_success() {
        let data: serde_json::Value = resp.json().await.map_err(|e| e.to_string())?;
        let content = data["response"].as_str().unwrap_or("").to_string();
        return Ok(content);
    }

    Err("Nessun AI disponibile. Configura una Groq API key o avvia Ollama.".to_string())
}

#[tauri::command]
async fn generate_from_url(url: String, api_key: String) -> Result<serde_json::Value, String> {
    let client = reqwest::Client::new();

    // Fetch the URL content
    let resp = client
        .get(&url)
        .header("User-Agent", "PostSync/1.0")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let content = resp.text().await.map_err(|e| e.to_string())?;

    // Extract title
    let title = if let Some(start) = content.find("<title>") {
        let start = start + 7;
        if let Some(end) = content[start..].find("</title>") {
            content[start..start + end].to_string()
        } else {
            "No title".to_string()
        }
    } else {
        "No title".to_string()
    };

    Ok(serde_json::json!({
        "title": title,
        "content": content[..content.len().min(3000)].to_string(),
        "type": "website"
    }))
}

#[tauri::command]
fn save_post(content: String, platforms: String, status: String) -> Result<i64, String> {
    let conn = rusqlite::Connection::open("postsync.db").map_err(|e| e.to_string())?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            platforms TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'draft',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )
    .map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO posts (content, platforms, status) VALUES (?1, ?2, ?3)",
        [&content, &platforms, &status],
    )
    .map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
fn get_posts() -> Result<Vec<serde_json::Value>, String> {
    let conn = rusqlite::Connection::open("postsync.db").map_err(|e| e.to_string())?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            platforms TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'draft',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )",
        [],
    )
    .map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare("SELECT id, content, platforms, status, created_at FROM posts ORDER BY created_at DESC")
        .map_err(|e| e.to_string())?;

    let posts = stmt
        .query_map([], |row| {
            Ok(serde_json::json!({
                "id": row.get::<_, i64>(0)?,
                "content": row.get::<_, String>(1)?,
                "platforms": row.get::<_, String>(2)?,
                "status": row.get::<_, String>(3)?,
                "createdAt": row.get::<_, String>(4)?
            }))
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(posts)
}

#[tauri::command]
fn delete_post(id: i64) -> Result<(), String> {
    let conn = rusqlite::Connection::open("postsync.db").map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM posts WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn save_api_key(key: String) -> Result<(), String> {
    std::fs::write("postsync_api_key.txt", &key).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_api_key() -> Result<String, String> {
    match std::fs::read_to_string("postsync_api_key.txt") {
        Ok(key) => Ok(key),
        Err(_) => Ok(String::new()),
    }
}
