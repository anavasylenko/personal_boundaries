// Airtable Configuration
// Fill in your credentials below, then this file handles syncing workbook answers to Airtable.
//
// SETUP:
// 1. Go to https://airtable.com/create/tokens — create a Personal Access Token
//    - Scope: data.records:write, data.records:read
//    - Access: add your base
// 2. Create a base with a table called "Workbook Responses" (or any name)
//    - Add these fields:
//      * session_id (Single line text)
//      * step_1_say_no_scale (Number)
//      * step_1_reactions (Long text)
//      * step_1_fear (Long text)
//      * step_1_areas (Long text)
//      * step_2_family_rules (Long text)
//      * step_2_childhood_no (Long text)
//      * step_2_role (Single line text)
//      * step_2_voice (Long text)
//      * step_3_values (Long text)
//      * step_3_values_violated (Long text)
//      * step_3_values_protect (Long text)
//      * step_4_body_signals (Long text)
//      * step_4_body_no (Long text)
//      * step_5_rights (Long text)
//      * step_6_situation (Long text)
//      * step_6_need (Long text)
//      * step_6_script (Long text)
//      * step_6_consequence (Long text)
//      * step_6_worst (Long text)
//      * step_6_cost (Long text)
//      * step_7_pushback (Long text)
//      * step_7_responses (Long text)
//      * step_8_guilt_voice (Long text)
//      * step_8_guilt_source (Long text)
//      * step_8_reframes (Long text)
//      * step_9_energy (Number)
//      * step_9_morning (Long text)
//      * step_9_evening (Long text)
//      * step_10_anchor (Long text)
//      * saved_at (Single line text)
//
// 3. Get your Base ID from the Airtable API docs page (starts with "app...")
// 4. Fill in the 3 values below:

const AIRTABLE_CONFIG = {
    // Your Personal Access Token (starts with "pat...")
    token: '',

    // Your Base ID (starts with "app...")
    baseId: '',

    // Your table name (exactly as it appears in Airtable)
    tableName: 'Workbook Responses'
};
