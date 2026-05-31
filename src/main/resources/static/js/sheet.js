function initDndSheet() {
    var toggle = document.getElementById('sheetEditToggle');
    if (!toggle) return;

    var sheet = document.querySelector('.sheet');

    toggle.addEventListener('click', function () {
        var editing = sheet.dataset.editing === 'true';
        sheet.dataset.editing = editing ? 'false' : 'true';
        toggle.querySelector('.edit-icon').textContent = editing ? 'edit' : 'edit_off';
    });
}