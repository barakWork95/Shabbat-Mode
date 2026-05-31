<?php
/**
 * Plugin Name: Shabbat Mode
 * Plugin URI:  https://github.com/your-username/shabbat-mode
 * Description: Automatically blocks your website during Shabbat hours.
 * Version:     1.0.0
 * Author:      Your Name
 * License:     GPL-2.0+
 * Text Domain: shabbat-mode
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// --- הגדרות ברירת מחדל ---
function shabbat_mode_defaults() {
    return [
        'city'             => 'Tel Aviv',
        'language'         => 'he',
        'bg_color'         => '#1a1a2e',
        'text_color'       => '#ffffff',
        'show_time'        => true,
    ];
}

// --- טעינת הסקריפט בפרונט ---
function shabbat_mode_enqueue_scripts() {
    $options = get_option( 'shabbat_mode_options', shabbat_mode_defaults() );

    wp_enqueue_script(
        'shabbat-mode',
        plugin_dir_url( __FILE__ ) . 'shabbat-mode.js',
        [],
        '1.0.0',
        false
    );

    // העברת ההגדרות מ-PHP ל-JS
    wp_localize_script( 'shabbat-mode', 'ShabbatModeConfig', [
        'city'       => $options['city'],
        'language'   => $options['language'],
        'bgColor'    => $options['bg_color'],
        'textColor'  => $options['text_color'],
        'showTime'   => $options['show_time'],
    ]);
}
add_action( 'wp_enqueue_scripts', 'shabbat_mode_enqueue_scripts' );

// --- תפריט הגדרות בלוח הבקרה ---
function shabbat_mode_admin_menu() {
    add_options_page(
        'Shabbat Mode Settings',
        'Shabbat Mode',
        'manage_options',
        'shabbat-mode',
        'shabbat_mode_settings_page'
    );
}
add_action( 'admin_menu', 'shabbat_mode_admin_menu' );

// --- שמירת הגדרות ---
function shabbat_mode_settings_page() {
    if ( isset( $_POST['shabbat_mode_save'] ) ) {
        $options = [
            'city'       => sanitize_text_field( $_POST['city'] ),
            'language'   => sanitize_text_field( $_POST['language'] ),
            'bg_color'   => sanitize_hex_color( $_POST['bg_color'] ),
            'text_color' => sanitize_hex_color( $_POST['text_color'] ),
            'show_time'  => isset( $_POST['show_time'] ),
        ];
        update_option( 'shabbat_mode_options', $options );
        echo '<div class="updated"><p>ההגדרות נשמרו בהצלחה ✅</p></div>';
    }

    $options = get_option( 'shabbat_mode_options', shabbat_mode_defaults() );
    ?>
    <div class="wrap">
        <h1>⚙️ Shabbat Mode – הגדרות</h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th>עיר</th>
                    <td><input type="text" name="city" value="<?php echo esc_attr($options['city']); ?>" class="regular-text" /></td>
                </tr>
                <tr>
                    <th>שפה</th>
                    <td>
                        <select name="language">
                            <option value="he" <?php selected($options['language'], 'he'); ?>>עברית</option>
                            <option value="en" <?php selected($options['language'], 'en'); ?>>English</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th>צבע רקע</th>
                    <td><input type="color" name="bg_color" value="<?php echo esc_attr($options['bg_color']); ?>" /></td>
                </tr>
                <tr>
                    <th>צבע טקסט</th>
                    <td><input type="color" name="text_color" value="<?php echo esc_attr($options['text_color']); ?>" /></td>
                </tr>
                <tr>
                    <th>הצג שעת מוצאי שבת</th>
                    <td><input type="checkbox" name="show_time" <?php checked($options['show_time']); ?> /></td>
                </tr>
            </table>
            <?php submit_button( 'שמור הגדרות', 'primary', 'shabbat_mode_save' ); ?>
        </form>
    </div>
    <?php
}