/// <reference path="../pb_types.d.ts" />
migrate(
  (app) => {
    console.log("[MIGRATION] Start adding department relation field");

    // Находим коллекцию profiles
    let profilesCollection = null;
    try {
      profilesCollection = app.findCollectionByNameOrId("users");
    } catch (_) {
      try {
        profilesCollection = app.findCollectionByNameOrId("pbc_715455300");
      } catch (_) {}
    }

    if (!profilesCollection) {
      console.log("⚠️ Collection 'users' not found, skipping");
      return;
    }

    // Находим коллекцию departments
    let departmentsCollection = null;
    try {
      departmentsCollection = app.findCollectionByNameOrId("departments");
    } catch (_) {}

    if (!departmentsCollection) {
      console.log("⚠️ Collection 'departments' not found, skipping");
      return;
    }

    // Проверяем, есть ли уже поле department
    const existingField = profilesCollection.fields.getByName("department");
    if (existingField) {
      console.log("⚠️ Field 'department' already exists, skipping");
      return;
    }

    // Создаем relation field
    const relationField = app.newRelationField();
    relationField.name = "department";
    relationField.collectionId = departmentsCollection.id;
    relationField.cascadeDelete = false;
    relationField.maxSelect = 1; // один отдел на пользователя
    relationField.minSelect = 0; // не обязательное поле
    relationField.displayFields = ["name"]; // отображаем name
    relationField.required = false;

    profilesCollection.fields.add(relationField);
    console.log("✅ Added department relation field");

    return app.save(profilesCollection);
  },
  (app) => {
    // Rollback: удаляем поле department
    try {
      console.log("[ROLLBACK] Start removing department relation field");

      let profilesCollection = null;
      try {
        profilesCollection = app.findCollectionByNameOrId("users");
      } catch (_) {
        try {
          profilesCollection = app.findCollectionByNameOrId("pbc_715455300");
        } catch (_) {}
      }

      if (!profilesCollection) {
        console.log("⚠️ Collection 'users' not found during rollback");
        return;
      }

      const field = profilesCollection.fields.getByName("department");
      if (!field) {
        console.log("⚠️ Field 'department' not found during rollback");
        return;
      }

      profilesCollection.fields.removeByName("department");
      console.log("✅ Rollback: removed department relation field");

      return app.save(profilesCollection);
    } catch (e) {
      console.error("❌ Rollback error:", e);
    }
  },
);
