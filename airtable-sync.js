// Airtable Sync for Workbook
// Sends workbook answers to Airtable when user clicks Save.
// Requires airtable-config.js to be loaded first.

(function() {
    if (typeof AIRTABLE_CONFIG === 'undefined') return;

    const SESSION_KEY = 'boundary-workbook-session';
    const RECORD_KEY = 'boundary-workbook-record-id';

    function getSessionId() {
        let id = localStorage.getItem(SESSION_KEY);
        if (!id) {
            id = 'session_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
            localStorage.setItem(SESSION_KEY, id);
        }
        return id;
    }

    function getCheckedValues(name) {
        const checked = [];
        document.querySelectorAll(`input[name="${name}"]:checked`).forEach(el => {
            checked.push(el.value);
        });
        return checked.join(', ');
    }

    function getRadioValue(name) {
        const el = document.querySelector(`input[name="${name}"]:checked`);
        return el ? el.value : '';
    }

    function getVal(id) {
        const el = document.getElementById(id);
        return el ? el.value : '';
    }

    function collectFields() {
        return {
            session_id: getSessionId(),
            step_1_say_no_scale: parseInt(getVal('q-sayno')) || 5,
            step_1_reactions: getCheckedValues('q-reaction') + (getVal('q-reaction-other') ? '\n' + getVal('q-reaction-other') : ''),
            step_1_fear: getVal('q-fear'),
            step_1_areas: getCheckedValues('q-areas'),
            step_2_family_rules: getCheckedValues('q-family-rules'),
            step_2_childhood_no: getVal('q-childhood-no'),
            step_2_role: getRadioValue('q-role') + (getVal('q-role-detail') ? ': ' + getVal('q-role-detail') : ''),
            step_2_voice: getVal('q-voice'),
            step_3_values: getCheckedValues('q-values') + (getVal('q-values-other') ? ', ' + getVal('q-values-other') : ''),
            step_3_values_violated: getVal('q-values-violated'),
            step_3_values_protect: getVal('q-values-protect'),
            step_4_body_signals: getCheckedValues('q-body') + (getVal('q-body-detail') ? '\n' + getVal('q-body-detail') : ''),
            step_4_body_no: getVal('q-body-no'),
            step_5_rights: getCheckedValues('q-rights') + (getVal('q-rights-custom') ? '\n' + getVal('q-rights-custom') : ''),
            step_6_situation: getVal('q-situation'),
            step_6_need: getVal('q-need'),
            step_6_script: getVal('q-script'),
            step_6_consequence: getVal('q-consequence'),
            step_6_worst: getVal('q-worst'),
            step_6_cost: getVal('q-cost'),
            step_7_pushback: getCheckedValues('q-pushback'),
            step_7_responses: [
                getVal('q-resp-guilt') ? 'Guilt-trip: ' + getVal('q-resp-guilt') : '',
                getVal('q-resp-anger') ? 'Anger: ' + getVal('q-resp-anger') : '',
                getVal('q-resp-silent') ? 'Silent treatment: ' + getVal('q-resp-silent') : '',
                getVal('q-resp-guilt-self') ? 'Self-guilt: ' + getVal('q-resp-guilt-self') : ''
            ].filter(Boolean).join('\n'),
            step_8_guilt_voice: getVal('q-guilt-voice'),
            step_8_guilt_source: getVal('q-guilt-source'),
            step_8_reframes: [
                getVal('q-reframe-old-1') && getVal('q-reframe-new-1') ? getVal('q-reframe-old-1') + ' → ' + getVal('q-reframe-new-1') : '',
                getVal('q-reframe-old-2') && getVal('q-reframe-new-2') ? getVal('q-reframe-old-2') + ' → ' + getVal('q-reframe-new-2') : '',
                getVal('q-reframe-old-3') && getVal('q-reframe-new-3') ? getVal('q-reframe-old-3') + ' → ' + getVal('q-reframe-new-3') : ''
            ].filter(Boolean).join('\n'),
            step_9_energy: parseInt(getVal('q-energy')) || 5,
            step_9_morning: [
                getVal('q-morning-capacity') ? 'Capacity: ' + getVal('q-morning-capacity') : '',
                getVal('q-morning-prepare') ? 'Prepare: ' + getVal('q-morning-prepare') : ''
            ].filter(Boolean).join('\n'),
            step_9_evening: [
                getVal('q-evening-honor') ? 'Honored: ' + getVal('q-evening-honor') : '',
                getVal('q-evening-abandon') ? 'Abandoned: ' + getVal('q-evening-abandon') : '',
                getVal('q-evening-learn') ? 'Learned: ' + getVal('q-evening-learn') : ''
            ].filter(Boolean).join('\n'),
            step_10_anchor: getVal('q-anchor'),
            saved_at: new Date().toISOString()
        };
    }

    async function syncToAirtable() {
        const { token, baseId, tableName } = AIRTABLE_CONFIG;

        if (!token || !baseId || !tableName) {
            console.warn('Airtable: config incomplete, skipping sync');
            return;
        }

        const fields = collectFields();
        const recordId = localStorage.getItem(RECORD_KEY);
        const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

        try {
            let response;

            if (recordId) {
                // Update existing record
                response = await fetch(`${url}/${recordId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fields })
                });
            } else {
                // Create new record
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fields })
                });
            }

            if (response.ok) {
                const result = await response.json();
                if (result.id) {
                    localStorage.setItem(RECORD_KEY, result.id);
                }
                console.log('Airtable: synced successfully');
            } else {
                const err = await response.json();
                console.error('Airtable sync error:', err);
            }
        } catch (e) {
            console.error('Airtable sync failed:', e);
        }
    }

    // Hook into save button
    document.addEventListener('DOMContentLoaded', () => {
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                syncToAirtable();
            });
        }
    });

    // Expose for manual use
    window.syncToAirtable = syncToAirtable;
})();
