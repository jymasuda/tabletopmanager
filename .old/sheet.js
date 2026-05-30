document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('sheetEditToggle');
    if (!toggle) return;

    toggle.addEventListener('click', function () {
        var sheet = document.querySelector('.sheet');
        var editing = sheet.dataset.editing === 'true';
        sheet.dataset.editing = editing ? 'false' : 'true';
        toggle.querySelector('.edit-icon').textContent = editing ? 'edit' : 'edit_off';
    });
});