/// <reference path="../pb_types.d.ts" />

migrate(
  (app) => {
    console.log("[MIGRATION] Start adding department relation field");

    // Найдём коллекцию profiles
    let profiles = null;
    try {
      profiles = app.findCollectionByNameOrId("profiles");
    } catch (_) {
      try {
        profiles = app.findCollectionByNameOrId("pbc_715455300");
      } catch (_) {}
    }
    if (!profiles) {
      console.log("⚠️ Collection 'profiles' not found, skipping");
      return;
    }

    // Найдём коллекцию departments
    let departments = null;
    try {
      departments = app.findCollectionByNameOrId("departments");
    } catch (_) {}
    if (!departments) {
      console.log("⚠️ Collection 'departments' not found, skipping");
      return;
    }

    // Проверка: если поле уже существует — пропускаем
    if (profiles.fields.getByName.("department")) {
      console.log("⚠️ Field 'department' already exists, skipping");
      return;
    }

    // Создаём поле relation
    const relation = new RelationField({
      name: "department",
      collectionId: departments.id,
      cascadeDelete: false,
      minSelect: 0,
      maxSelect: 1,
      displayFields: ["name"],
      required: false,
      unique: false,
    });

    // Добавляем поле
    if (profiles.fields && typeof profiles.fields.add === "function") {
      profiles.fields.add(relation);
    } else if (profiles.schema && typeof profiles.schema.add === "function") {
      profiles.schema.add(relation);
    } else {
      throw new Error("Cannot add field: unsupported collection object structure");
    }

    console.log("✅ Added department relation field");
    return app.saveCollection(profiles);
  },
  (app) => {
    console.log("[ROLLBACK] Start removing department relation field");

    let profiles = null;
    try {
      profiles = app.findCollectionByNameOrId("profiles");
    } catch (_) {
      try {
        profiles = app.findCollectionByNameOrId("pbc_715455300");
      } catch (_) {}
    }
    if (!profiles) {
      console.log("⚠️ Collection 'profiles' not found during rollback");
      return;
    }

    const field = (profiles.fields && profiles.fields.getByName?.("department"))
                   || (profiles.schema && profiles.schema.getByName?.("department"));
    if (!field) {
      console.log("⚠️ Field 'department' not found during rollback, skipping");
      return;
    }

    if (profiles.fields && typeof profiles.fields.removeByName === "function") {
      profiles.fields.removeByName("department");
    } else if (profiles.schema && typeof profiles.schema.removeByName === "function") {
      profiles.schema.removeByName("department");
    } else {
      throw new Error("Cannot remove field: unsupported collection object structure");
    }

    console.log("✅ Rollback: removed department relation field");
    return app.saveCollection(profiles);
  }
);


