let settings_button = document.getElementById('settings_button');
let close_settings_button = document.getElementById('close-settings');
let settings_menu = document.getElementById('cover-color');

settings_button.onclick = () => 
{
    settings_menu.style.display = 'flex';
}

close_settings_button.onclick = () =>
{
    settings_menu.style.display = 'none';
}