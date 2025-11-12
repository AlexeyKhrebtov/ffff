/// <reference path="../pb_types.d.ts" />

migrate(
  (app) => {
    console.log("[MIGRATION] Start adding department row");

    // Найдём коллекцию departments
    departments = app.findCollectionByNameOrId("departments");
    
    if (!departments) {
      console.log("⚠️ Collection 'departments' not found, skipping");
      return;
    }

    let record = new Record(departments)
    
    record.set("name", "Lorem ipsum")
    
    console.log("✅ Added row");
    app.save(record);
  },
  (app) => {
    
  }
);
