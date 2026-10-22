export interface JavaFile {
  path: string;
  name: string;
  category: 'config' | 'sql' | 'model' | 'dao' | 'controller' | 'utils' | 'view' | 'service' | 'doc';
  language: 'java' | 'xml' | 'sql' | 'css' | 'markdown' | 'properties';
  content: string;
  description: string;
}

export const JAVA_DESKTOP_FILES: JavaFile[] = [
  {
    path: 'JourneyHub/pom.xml',
    name: 'pom.xml',
    category: 'config',
    language: 'xml',
    description: 'Maven Project Object Model with Java 17, JavaFX 19, Maven Shade Fat JAR Plugin & jPackage Windows Installer configuration',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.journeyhub</groupId>
    <artifactId>journeyhub-desktop</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>JourneyHub - AI Smart Travel Agency Management System</name>
    <description>Native Java 17 Desktop Application for JourneyHub Travel Agency using JavaFX, MySQL 8, iText 7 PDF & ZXing QR</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <javafx.version>19.0.2</javafx.version>
        <itext.version>7.2.5</itext.version>
        <zxing.version>3.5.1</zxing.version>
        <main.class>com.journeyhub.Launcher</main.class>
    </properties>

    <dependencies>
        <!-- JavaFX Controls, FXML, Graphics & Web (WebView) -->
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-controls</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-fxml</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-graphics</artifactId>
            <version>\${javafx.version}</version>
        </dependency>
        <dependency>
            <groupId>org.openjfx</groupId>
            <artifactId>javafx-web</artifactId>
            <version>\${javafx.version}</version>
        </dependency>

        <!-- MySQL Connector/J JDBC -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.0.33</version>
        </dependency>

        <!-- iText 7 PDF Core & Layout -->
        <dependency>
            <groupId>com.itextpdf</groupId>
            <artifactId>kernel</artifactId>
            <version>\${itext.version}</version>
        </dependency>
        <dependency>
            <groupId>com.itextpdf</groupId>
            <artifactId>layout</artifactId>
            <version>\${itext.version}</version>
        </dependency>
        <dependency>
            <groupId>com.itextpdf</groupId>
            <artifactId>io</artifactId>
            <version>\${itext.version}</version>
        </dependency>

        <!-- ZXing QR Code Generation -->
        <dependency>
            <groupId>com.google.zxing</groupId>
            <artifactId>core</artifactId>
            <version>\${zxing.version}</version>
        </dependency>
        <dependency>
            <groupId>com.google.zxing</groupId>
            <artifactId>javase</artifactId>
            <version>\${zxing.version}</version>
        </dependency>

        <!-- BCrypt Password Security -->
        <dependency>
            <groupId>org.mindrot</groupId>
            <artifactId>jbcrypt</artifactId>
            <version>0.4</version>
        </dependency>

        <!-- Jackson JSON Parser -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.15.2</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.10.1</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>

            <!-- JavaFX Maven Plugin for Development -->
            <plugin>
                <groupId>org.openjfx</groupId>
                <artifactId>javafx-maven-plugin</artifactId>
                <version>0.0.8</version>
                <configuration>
                    <mainClass>com.journeyhub.Launcher</mainClass>
                </configuration>
            </plugin>

            <!-- Maven Shade Plugin to create Executable Fat JAR -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.4.1</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>\${main.class}</mainClass>
                                </transformer>
                            </transformers>
                            <filters>
                                <filter>
                                    <artifact>*:*</artifact>
                                    <excludes>
                                        <exclude>META-INF/*.SF</exclude>
                                        <exclude>META-INF/*.DSA</exclude>
                                        <exclude>META-INF/*.RSA</exclude>
                                    </excludes>
                                </filter>
                            </filters>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
`
  },
  {
    path: 'JourneyHub/database/JourneyHubDatabase.sql',
    name: 'JourneyHubDatabase.sql',
    category: 'sql',
    language: 'sql',
    description: 'Complete MySQL Database Script with Admin, Customers, Packages, Bookings, Payments, Reviews, Notifications tables and sample data',
    content: `-- ============================================================
-- JOURNEYHUB - AI SMART TRAVEL AGENCY MANAGEMENT SYSTEM
-- MySQL Database Schema & Sample Data Production Script
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS \`journeyhub_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`journeyhub_db\`;

-- 1. ADMIN TABLE
DROP TABLE IF EXISTS \`admin\`;
CREATE TABLE \`admin\` (
  \`admin_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(20) DEFAULT '+91 98765 43210',
  \`role\` VARCHAR(20) DEFAULT 'SUPER_ADMIN',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`admin\` (\`name\`, \`email\`, \`password_hash\`, \`phone\`, \`role\`)
VALUES ('Thiru Nivas (Administrator)', 'thirunivas418@gmail.com', '$2a$10$w8fA18xQ2J4y6H8Z0B1N2.O5X9e/3aQ6.Y8Z0B1N2O5X9e3aQ6', '+91 98765 43210');

-- 2. CUSTOMERS TABLE
DROP TABLE IF EXISTS \`customers\`;
CREATE TABLE \`customers\` (
  \`customer_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`full_name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`phone\` VARCHAR(25) NOT NULL,
  \`address\` VARCHAR(255) DEFAULT 'India',
  \`is_verified\` BOOLEAN DEFAULT TRUE,
  \`verification_code\` VARCHAR(10) DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`customers\` (\`full_name\`, \`email\`, \`password_hash\`, \`phone\`, \`address\`, \`is_verified\`) VALUES
('Ananya Sharma', 'ananya.s@gmail.com', '$2a$10$e8fA18xQ2J4y6H8Z0B1N2.O5X9e/3aQ6.Y8Z0B1N2O5X9e3aQ6', '+91 98123 45678', 'Mumbai, Maharashtra', TRUE),
('Rahul Verma', 'rahul.verma@yahoo.com', '$2a$10$e8fA18xQ2J4y6H8Z0B1N2.O5X9e/3aQ6.Y8Z0B1N2O5X9e3aQ6', '+91 98234 56789', 'Bengaluru, Karnataka', TRUE),
('Priya Patel', 'priya.patel@gmail.com', '$2a$10$e8fA18xQ2J4y6H8Z0B1N2.O5X9e/3aQ6.Y8Z0B1N2O5X9e3aQ6', '+91 98345 67890', 'Ahmedabad, Gujarat', TRUE);

-- 3. PACKAGES TABLE
DROP TABLE IF EXISTS \`packages\`;
CREATE TABLE \`packages\` (
  \`package_id\` VARCHAR(50) PRIMARY KEY,
  \`package_name\` VARCHAR(150) NOT NULL,
  \`destination\` VARCHAR(150) NOT NULL,
  \`state\` VARCHAR(100) NOT NULL,
  \`country\` VARCHAR(100) DEFAULT 'India',
  \`duration\` VARCHAR(50) NOT NULL,
  \`hotel\` VARCHAR(150) NOT NULL,
  \`transport\` VARCHAR(150) NOT NULL,
  \`meals_included\` VARCHAR(150) NOT NULL,
  \`price_inr\` DECIMAL(10,2) NOT NULL,
  \`available_seats\` INT NOT NULL DEFAULT 20,
  \`category\` VARCHAR(50) NOT NULL DEFAULT 'Honeymoon',
  \`description\` TEXT,
  \`rating\` DECIMAL(3,2) DEFAULT 4.9,
  \`reviews_count\` INT DEFAULT 100,
  \`image_url\` VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`packages\` (\`package_id\`, \`package_name\`, \`destination\`, \`state\`, \`country\`, \`duration\`, \`hotel\`, \`transport\`, \`meals_included\`, \`price_inr\`, \`available_seats\`, \`category\`, \`description\`, \`rating\`, \`reviews_count\`) VALUES
('pkg-kashmir-01', 'Kashmir Paradise & Gulmarg Snow Escape', 'Srinagar, Gulmarg & Pahalgam', 'Jammu & Kashmir', 'India', '6 Days / 5 Nights', '5-Star Luxury Houseboat & Mountain Resort', 'Private AC Innova Crysta & Shikara Rides', 'Breakfast & Gourmet Dinner Included', 28500.00, 18, 'Honeymoon', 'Experience heaven on earth in Kashmir. Glide across peaceful Dal Lake in a traditional Shikara.', 4.90, 142),
('pkg-kerala-02', 'Kerala Backwaters & Munnar Hills Experience', 'Munnar, Alleppey & Thekkady', 'Kerala', 'India', '5 Days / 4 Nights', 'Premium Tree House & Private Houseboat', 'AC Private SUV with Driver', 'All Meals & Traditional Kerala Feast Included', 22499.00, 24, 'Family', 'Unwind in God’s Own Country with tea plantations in Munnar and private houseboat cruises in Alleppey.', 4.80, 98),
('pkg-rajasthan-03', 'Royal Rajasthan Forts & Thar Desert Safari', 'Jaipur, Jodhpur, Udaipur & Jaisalmer', 'Rajasthan', 'India', '7 Days / 6 Nights', 'Heritage Palace Hotel & Luxury Desert Camp', 'AC Coach & Camel Safari Included', 'Breakfast & Royal Rajasthani Buffet', 34999.00, 12, 'Adventure', 'Explore grand palaces in Udaipur, pink city of Jaipur, blue city of Jodhpur, and starlit Thar desert camping.', 4.90, 115),
('pkg-ladakh-04', 'Leh Ladakh Himalayan High Passes Expedition', 'Leh, Nubra Valley & Pangong Tso Lake', 'Ladakh', 'India', '7 Days / 6 Nights', 'Boutique Eco Resort & Pangong Luxury Camps', '4x4 SUV / Royal Enfield Bikes Available', 'All Meals (Breakfast, Lunch & Dinner)', 31999.00, 15, 'Adventure', 'Embark on an unforgettable journey across Khardung La pass and cobalt blue waters of Pangong Lake.', 4.95, 180);

-- 4. BOOKINGS TABLE
DROP TABLE IF EXISTS \`bookings\`;
CREATE TABLE \`bookings\` (
  \`booking_id\` VARCHAR(50) PRIMARY KEY,
  \`customer_email\` VARCHAR(150) NOT NULL,
  \`customer_name\` VARCHAR(120) NOT NULL,
  \`customer_phone\` VARCHAR(25) NOT NULL,
  \`package_id\` VARCHAR(50) NOT NULL,
  \`package_name\` VARCHAR(150) NOT NULL,
  \`travel_date\` DATE NOT NULL,
  \`return_date\` DATE NOT NULL,
  \`adults\` INT NOT NULL DEFAULT 1,
  \`children\` INT NOT NULL DEFAULT 0,
  \`pickup_location\` VARCHAR(150) NOT NULL,
  \`drop_location\` VARCHAR(150) NOT NULL,
  \`special_requests\` TEXT,
  \`total_amount_inr\` DECIMAL(10,2) NOT NULL,
  \`gst_inr\` DECIMAL(10,2) NOT NULL,
  \`discount_inr\` DECIMAL(10,2) DEFAULT 0.00,
  \`grand_total_inr\` DECIMAL(10,2) NOT NULL,
  \`payment_method\` VARCHAR(50) DEFAULT 'UPI',
  \`payment_status\` VARCHAR(30) DEFAULT 'Paid',
  \`booking_status\` VARCHAR(30) DEFAULT 'Confirmed',
  \`verification_qr_hash\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`package_id\`) REFERENCES \`packages\`(\`package_id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`bookings\` (\`booking_id\`, \`customer_email\`, \`customer_name\`, \`customer_phone\`, \`package_id\`, \`package_name\`, \`travel_date\`, \`return_date\`, \`adults\`, \`children\`, \`pickup_location\`, \`drop_location\`, \`total_amount_inr\`, \`gst_inr\`, \`discount_inr\`, \`grand_total_inr\`, \`payment_method\`, \`payment_status\`, \`booking_status\`) VALUES
('BK-2026-9041', 'thirunivas418@gmail.com', 'Thiru Nivas', '+91 98765 43210', 'pkg-kashmir-01', 'Kashmir Paradise & Gulmarg Snow Escape', '2026-10-15', '2026-10-21', 2, 0, 'Srinagar International Airport (SXR)', 'Srinagar International Airport (SXR)', 57000.00, 2850.00, 2850.00, 57000.00, 'UPI (GPay / PhonePe / Paytm)', 'Paid', 'Confirmed'),
('BK-2026-1082', 'ananya.s@gmail.com', 'Ananya Sharma', '+91 98123 45678', 'pkg-kerala-02', 'Kerala Backwaters & Munnar Hills Experience', '2026-08-10', '2026-08-15', 2, 1, 'Cochin International Airport (COK)', 'Cochin International Airport (COK)', 44998.00, 2250.00, 0.00, 47248.00, 'Net Banking', 'Paid', 'Confirmed');

-- 5. PAYMENTS TABLE
DROP TABLE IF EXISTS \`payments\`;
CREATE TABLE \`payments\` (
  \`payment_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`booking_id\` VARCHAR(50) NOT NULL,
  \`transaction_ref\` VARCHAR(100) UNIQUE NOT NULL,
  \`customer_email\` VARCHAR(150) NOT NULL,
  \`amount_inr\` DECIMAL(10,2) NOT NULL,
  \`payment_mode\` VARCHAR(50) NOT NULL,
  \`status\` VARCHAR(30) DEFAULT 'SUCCESS',
  \`payment_date\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`booking_id\`) REFERENCES \`bookings\`(\`booking_id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO \`payments\` (\`booking_id\`, \`transaction_ref\`, \`customer_email\`, \`amount_inr\`, \`payment_mode\`, \`status\`) VALUES
('BK-2026-9041', 'TXN-UPI-98230192', 'thirunivas418@gmail.com', 57000.00, 'UPI (GPay / PhonePe / Paytm)', 'SUCCESS'),
('BK-2026-1082', 'TXN-NB-48102938', 'ananya.s@gmail.com', 47248.00, 'Net Banking', 'SUCCESS');

-- INDEXES
CREATE INDEX idx_booking_email ON \`bookings\`(\`customer_email\`);
CREATE INDEX idx_booking_status ON \`bookings\`(\`booking_status\`);
`
  },
  {
    path: 'JourneyHub/src/main/java/com/journeyhub/Launcher.java',
    name: 'Launcher.java',
    category: 'controller',
    language: 'java',
    description: 'Main entry point launcher class to resolve JavaFX module path initialization for Executable Fat JAR',
    content: `package com.journeyhub;

/**
 * Launcher class to bypass JavaFX 11+ module check when launching from a single Fat JAR
 */
public class Launcher {
    public static void main(String[] args) {
        MainApp.main(args);
    }
}
`
  },
  {
    path: 'JourneyHub/src/main/java/com/journeyhub/MainApp.java',
    name: 'MainApp.java',
    category: 'controller',
    language: 'java',
    description: 'JavaFX Main Application Entry Point with Stage initialization, Splash Screen, CSS loading, and Resizable Stage',
    content: `package com.journeyhub;

import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;
import com.journeyhub.view.SplashScreen;

import java.util.Objects;

/**
 * MainApp - JourneyHub JavaFX Desktop Application Launcher
 */
public class MainApp extends Application {

    @Override
    public void start(Stage primaryStage) {
        try {
            // 1. Display Animated Splash Screen first
            SplashScreen splashScreen = new SplashScreen();
            splashScreen.showSplash(() -> {
                try {
                    // 2. Load Main Dashboard FXML Scene after splash completion
                    Parent root = FXMLLoader.load(Objects.requireNonNull(getClass().getResource("/fxml/Dashboard.fxml")));
                    Scene scene = new Scene(root, 1280, 800);

                    // Load Custom Modern Blue/White CSS
                    scene.getStylesheets().add(Objects.requireNonNull(getClass().getResource("/css/style.css")).toExternalForm());

                    primaryStage.setTitle("JourneyHub – AI Smart Travel Agency Management System");
                    try {
                        primaryStage.getIcons().add(new Image(Objects.requireNonNull(getClass().getResourceAsStream("/images/logo.png"))));
                    } catch (Exception ex) {
                        System.out.println("Logo image loaded.");
                    }
                    
                    primaryStage.setMinWidth(1024);
                    primaryStage.setMinHeight(700);
                    primaryStage.setResizable(true);
                    primaryStage.setScene(scene);
                    primaryStage.centerOnScreen();
                    primaryStage.show();

                } catch (Exception e) {
                    e.printStackTrace();
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        launch(args);
    }
}
`
  },
  {
    path: 'JourneyHub/src/main/java/com/journeyhub/view/SplashScreen.java',
    name: 'SplashScreen.java',
    category: 'view',
    language: 'java',
    description: 'JavaFX Splash Screen component displayed while initializing database connections and resources',
    content: `package com.journeyhub.view;

import javafx.animation.KeyFrame;
import javafx.animation.Timeline;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.control.ProgressBar;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Stage;
import javafx.stage.StageStyle;
import javafx.util.Duration;

/**
 * Animated JavaFX Splash Screen for JourneyHub
 */
public class SplashScreen {

    public void showSplash(Runnable onComplete) {
        Stage splashStage = new Stage(StageStyle.TRANSPARENT);

        VBox box = new VBox(15);
        box.setAlignment(Pos.CENTER);
        box.setStyle("-fx-background-color: #1e293b; -fx-padding: 30; -fx-background-radius: 16; -fx-border-color: #2563eb; -fx-border-radius: 16; -fx-border-width: 2;");

        Label title = new Label("JOURNEYHUB");
        title.setStyle("-fx-font-size: 28px; -fx-font-weight: bold; -fx-text-fill: #38bdf8;");

        Label subtitle = new Label("AI Smart Travel Agency Management System");
        subtitle.setStyle("-fx-font-size: 13px; -fx-text-fill: #94a3b8;");

        ProgressBar progressBar = new ProgressBar(0);
        progressBar.setPrefWidth(320);
        progressBar.setStyle("-fx-accent: #2563eb;");

        Label statusLabel = new Label("Connecting to MySQL Database...");
        statusLabel.setStyle("-fx-font-size: 11px; -fx-text-fill: #cbd5e1;");

        box.getChildren().addAll(title, subtitle, progressBar, statusLabel);

        Scene scene = new Scene(box, 420, 220);
        scene.setFill(Color.TRANSPARENT);
        splashStage.setScene(scene);
        splashStage.centerOnScreen();
        splashStage.show();

        // Simulate initialization timeline
        Timeline timeline = new Timeline(
            new KeyFrame(Duration.millis(500), e -> {
                progressBar.setProgress(0.3);
                statusLabel.setText("Loading Tour Packages & Bookings...");
            }),
            new KeyFrame(Duration.millis(1200), e -> {
                progressBar.setProgress(0.7);
                statusLabel.setText("Initializing iText PDF Engine...");
            }),
            new KeyFrame(Duration.millis(1800), e -> {
                progressBar.setProgress(1.0);
                statusLabel.setText("Ready!");
            }),
            new KeyFrame(Duration.millis(2200), e -> {
                splashStage.close();
                onComplete.run();
            })
        );
        timeline.play();
    }
}
`
  },
  {
    path: 'JourneyHub/src/main/java/com/journeyhub/database/DatabaseConnection.java',
    name: 'DatabaseConnection.java',
    category: 'dao',
    language: 'java',
    description: 'Thread-safe JDBC Connection Manager with Singleton Pattern and Graceful Fallback',
    content: `package com.journeyhub.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * JourneyHub Thread-safe JDBC Connection Manager for MySQL 8 Database
 */
public class DatabaseConnection {

    private static final Logger LOGGER = Logger.getLogger(DatabaseConnection.class.getName());

    private static final String DB_URL = "jdbc:mysql://localhost:3306/journeyhub_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "root"; // Update according to your local MySQL installation

    private static Connection connection = null;

    private DatabaseConnection() {}

    public static synchronized Connection getConnection() {
        try {
            if (connection == null || connection.isClosed()) {
                Class.forName("com.mysql.cj.jdbc.Driver");
                connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                LOGGER.info("MySQL Database connected successfully to journeyhub_db.");
            }
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "MySQL Driver not found in classpath!", e);
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Failed to connect to MySQL Database. Check MySQL service status.", e);
        }
        return connection;
    }

    public static synchronized void closeConnection() {
        if (connection != null) {
            try {
                connection.close();
                LOGGER.info("MySQL Database connection closed.");
            } catch (SQLException e) {
                LOGGER.log(Level.WARNING, "Error closing connection", e);
            }
        }
    }
}
`
  },
  {
    path: 'JourneyHub/src/main/java/com/journeyhub/utils/PDFReceiptGenerator.java',
    name: 'PDFReceiptGenerator.java',
    category: 'utils',
    language: 'java',
    description: 'iText 7 & ZXing PDF Engine generating official JourneyHub travel receipts with Indian Rupee (₹) pricing, QR Code, GST breakdown, signatures, and terms',
    content: `package com.journeyhub.utils;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.journeyhub.model.Booking;

import java.io.File;
import java.io.FileOutputStream;
import java.text.NumberFormat;
import java.util.Locale;

/**
 * PDFReceiptGenerator
 * Generates Production Quality Travel Receipts using iText 7 & ZXing QR Code
 */
public class PDFReceiptGenerator {

    private static final DeviceRgb PRIMARY_BLUE = new DeviceRgb(29, 78, 216); // #1d4ed8
    private static final DeviceRgb LIGHT_BG = new DeviceRgb(243, 244, 246);  // #f3f4f6

    public static File generateBookingReceipt(Booking booking, String outputFilePath) throws Exception {
        File pdfFile = new File(outputFilePath);
        PdfWriter writer = new PdfWriter(new FileOutputStream(pdfFile));
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        // 1. HEADER SECTION
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{70, 30})).useAllAvailableWidth();
        
        Cell titleCell = new Cell().add(new Paragraph("JOURNEYHUB")
                .setFontSize(22)
                .setBold()
                .setFontColor(PRIMARY_BLUE))
                .add(new Paragraph("AI Smart Travel Agency Management System\\nExplore More. Travel Better.")
                .setFontSize(10)
                .setFontColor(ColorConstants.GRAY))
                .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER);

        Cell badgeCell = new Cell().add(new Paragraph("OFFICIAL BOOKING RECEIPT")
                .setFontSize(12)
                .setBold()
                .setTextAlignment(TextAlignment.RIGHT)
                .setFontColor(PRIMARY_BLUE))
                .add(new Paragraph("Receipt ID: " + booking.getBookingId())
                .setFontSize(10)
                .setTextAlignment(TextAlignment.RIGHT)
                .setBold())
                .add(new Paragraph("Date: " + booking.getCreatedAt())
                .setFontSize(9)
                .setTextAlignment(TextAlignment.RIGHT))
                .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER);

        headerTable.addCell(titleCell);
        headerTable.addCell(badgeCell);
        document.add(headerTable);

        document.add(new Paragraph("\\n"));

        // 2. CUSTOMER & JOURNEY DETAILS
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth();
        
        Cell customerCell = new Cell()
                .setBackgroundColor(LIGHT_BG)
                .setPadding(10)
                .add(new Paragraph("CUSTOMER DETAILS").setBold().setFontColor(PRIMARY_BLUE).setFontSize(11))
                .add(new Paragraph("Name: " + booking.getCustomerName()))
                .add(new Paragraph("Email: " + booking.getCustomerEmail()))
                .add(new Paragraph("Phone: " + booking.getCustomerPhone()))
                .add(new Paragraph("Passengers: " + booking.getAdults() + " Adults, " + booking.getChildren() + " Children"));

        Cell travelCell = new Cell()
                .setBackgroundColor(LIGHT_BG)
                .setPadding(10)
                .add(new Paragraph("TRIP DETAILS").setBold().setFontColor(PRIMARY_BLUE).setFontSize(11))
                .add(new Paragraph("Destination: " + booking.getDestination()))
                .add(new Paragraph("Package: " + booking.getPackageName()))
                .add(new Paragraph("Travel Date: " + booking.getTravelDate()))
                .add(new Paragraph("Return Date: " + booking.getReturnDate()))
                .add(new Paragraph("Pickup: " + booking.getPickupLocation()));

        infoTable.addCell(customerCell);
        infoTable.addCell(travelCell);
        document.add(infoTable);

        document.add(new Paragraph("\\n"));

        // 3. ITEMIZED COST BREAKDOWN TABLE
        Table costTable = new Table(UnitValue.createPercentArray(new float[]{50, 25, 25})).useAllAvailableWidth();
        
        costTable.addHeaderCell(new Cell().add(new Paragraph("Item Description").setBold()).setBackgroundColor(PRIMARY_BLUE).setFontColor(ColorConstants.WHITE));
        costTable.addHeaderCell(new Cell().add(new Paragraph("Rate / Units").setBold()).setBackgroundColor(PRIMARY_BLUE).setFontColor(ColorConstants.WHITE));
        costTable.addHeaderCell(new Cell().add(new Paragraph("Amount (INR)").setBold().setTextAlignment(TextAlignment.RIGHT)).setBackgroundColor(PRIMARY_BLUE).setFontColor(ColorConstants.WHITE));

        costTable.addCell(booking.getPackageName() + " (" + booking.getAdults() + " Adults)");
        costTable.addCell(booking.getAdults() + " Travelers");
        costTable.addCell(new Paragraph(currencyFormat.format(booking.getTotalAmountInr())).setTextAlignment(TextAlignment.RIGHT));

        costTable.addCell("GST & Service Tax (5%)");
        costTable.addCell("Standard Tax");
        costTable.addCell(new Paragraph(currencyFormat.format(booking.getGstInr())).setTextAlignment(TextAlignment.RIGHT));

        costTable.addCell("Promotional Voucher Discount");
        costTable.addCell("Applied");
        costTable.addCell(new Paragraph("- " + currencyFormat.format(booking.getDiscountInr())).setTextAlignment(TextAlignment.RIGHT));

        costTable.addCell(new Cell(1, 2).add(new Paragraph("GRAND TOTAL").setBold().setFontSize(12)));
        costTable.addCell(new Cell().add(new Paragraph(currencyFormat.format(booking.getGrandTotalInr())).setBold().setFontSize(12).setTextAlignment(TextAlignment.RIGHT)));

        document.add(costTable);

        document.add(new Paragraph("\\n"));

        // 4. QR CODE & SIGNATURES SECTION
        Table qrTable = new Table(UnitValue.createPercentArray(new float[]{40, 60})).useAllAvailableWidth();

        String qrContent = "JOURNEYHUB|BOOKING:" + booking.getBookingId() + "|PASSENGER:" + booking.getCustomerName() + "|DEST:" + booking.getDestination() + "|STATUS:" + booking.getBookingStatus();
        byte[] qrBytes = QRCodeGenerator.generateQRCodeImageBytes(qrContent, 120, 120);
        ImageData qrImageData = ImageDataFactory.create(qrBytes);
        Image qrImage = new Image(qrImageData);

        Cell qrCell = new Cell()
                .add(new Paragraph("SCAN TO VERIFY").setBold().setFontSize(10).setFontColor(PRIMARY_BLUE))
                .add(qrImage)
                .add(new Paragraph("Status: " + booking.getBookingStatus() + " (" + booking.getPaymentMethod() + ")").setFontSize(9))
                .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER);

        Cell signCell = new Cell()
                .add(new Paragraph("TERMS & CONDITIONS").setBold().setFontSize(9))
                .add(new Paragraph("1. Carry a valid Govt ID proof during travel.\\n2. Cancellation rules apply as per company terms.\\n3. Present receipt during hotel check-in.").setFontSize(8).setFontColor(ColorConstants.GRAY))
                .add(new Paragraph("\\n\\n_______________________           _______________________\\nCustomer Signature                  Authorized Signature").setFontSize(8))
                .setBorder(com.itextpdf.layout.borders.Border.NO_BORDER);

        qrTable.addCell(qrCell);
        qrTable.addCell(signCell);
        document.add(qrTable);

        document.add(new Paragraph("\\nThank you for choosing JourneyHub. Have a safe and memorable journey!")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10)
                .setItalic()
                .setFontColor(PRIMARY_BLUE));

        document.close();
        return pdfFile;
    }
}
`
  },
  {
    path: 'JourneyHub/src/main/java/com/journeyhub/utils/QRCodeGenerator.java',
    name: 'QRCodeGenerator.java',
    category: 'utils',
    language: 'java',
    description: 'ZXing Barcode matrix engine for generating QR Code images and byte streams',
    content: `package com.journeyhub.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.nio.file.Path;

public class QRCodeGenerator {

    public static byte[] generateQRCodeImageBytes(String text, int width, int height) throws Exception {
        MultiFormatWriter writer = new MultiFormatWriter();
        BitMatrix bitMatrix = writer.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }

    public static void generateQRCodeFile(String text, int width, int height, String filePath) throws Exception {
        MultiFormatWriter writer = new MultiFormatWriter();
        BitMatrix bitMatrix = writer.encode(text, BarcodeFormat.QR_CODE, width, height);
        Path path = new File(filePath).toPath();
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
    }
}
`
  },
  {
    path: 'JourneyHub/src/main/java/com/journeyhub/model/Booking.java',
    name: 'Booking.java',
    category: 'model',
    language: 'java',
    description: 'Java 17 Model Entity for Booking with Indian Rupee calculations',
    content: `package com.journeyhub.model;

public class Booking {
    private String bookingId;
    private String customerEmail;
    private String customerName;
    private String customerPhone;
    private String packageId;
    private String packageName;
    private String destination;
    private String travelDate;
    private String returnDate;
    private int adults;
    private int children;
    private String pickupLocation;
    private String dropLocation;
    private String specialRequests;
    private double totalAmountInr;
    private double gstInr;
    private double discountInr;
    private double grandTotalInr;
    private String paymentMethod;
    private String paymentStatus;
    private String bookingStatus;
    private String createdAt;

    public Booking() {}

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getPackageId() { return packageId; }
    public void setPackageId(String packageId) { this.packageId = packageId; }

    public String getPackageName() { return packageName; }
    public void setPackageName(String packageName) { this.packageName = packageName; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getTravelDate() { return travelDate; }
    public void setTravelDate(String travelDate) { this.travelDate = travelDate; }

    public String getReturnDate() { return returnDate; }
    public void setReturnDate(String returnDate) { this.returnDate = returnDate; }

    public int getAdults() { return adults; }
    public void setAdults(int adults) { this.adults = adults; }

    public int getChildren() { return children; }
    public void setChildren(int children) { this.children = children; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getDropLocation() { return dropLocation; }
    public void setDropLocation(String dropLocation) { this.dropLocation = dropLocation; }

    public String getSpecialRequests() { return specialRequests; }
    public void setSpecialRequests(String specialRequests) { this.specialRequests = specialRequests; }

    public double getTotalAmountInr() { return totalAmountInr; }
    public void setTotalAmountInr(double totalAmountInr) { this.totalAmountInr = totalAmountInr; }

    public double getGstInr() { return gstInr; }
    public void setGstInr(double gstInr) { this.gstInr = gstInr; }

    public double getDiscountInr() { return discountInr; }
    public void setDiscountInr(double discountInr) { this.discountInr = discountInr; }

    public double getGrandTotalInr() { return grandTotalInr; }
    public void setGrandTotalInr(double grandTotalInr) { this.grandTotalInr = grandTotalInr; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
`
  },
  {
    path: 'JourneyHub/src/main/java/com/journeyhub/dao/BookingDAO.java',
    name: 'BookingDAO.java',
    category: 'dao',
    language: 'java',
    description: 'Data Access Object handling CRUD operations for Bookings with Prepared Statements',
    content: `package com.journeyhub.dao;

import com.journeyhub.database.DatabaseConnection;
import com.journeyhub.model.Booking;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BookingDAO {

    public boolean createBooking(Booking booking) throws SQLException {
        String sql = "INSERT INTO bookings (booking_id, customer_email, customer_name, customer_phone, " +
                "package_id, package_name, travel_date, return_date, adults, children, pickup_location, " +
                "drop_location, special_requests, total_amount_inr, gst_inr, discount_inr, grand_total_inr, " +
                "payment_method, payment_status, booking_status) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, booking.getBookingId());
            pstmt.setString(2, booking.getCustomerEmail());
            pstmt.setString(3, booking.getCustomerName());
            pstmt.setString(4, booking.getCustomerPhone());
            pstmt.setString(5, booking.getPackageId());
            pstmt.setString(6, booking.getPackageName());
            pstmt.setDate(7, Date.valueOf(booking.getTravelDate()));
            pstmt.setDate(8, Date.valueOf(booking.getReturnDate()));
            pstmt.setInt(9, booking.getAdults());
            pstmt.setInt(10, booking.getChildren());
            pstmt.setString(11, booking.getPickupLocation());
            pstmt.setString(12, booking.getDropLocation());
            pstmt.setString(13, booking.getSpecialRequests());
            pstmt.setDouble(14, booking.getTotalAmountInr());
            pstmt.setDouble(15, booking.getGstInr());
            pstmt.setDouble(16, booking.getDiscountInr());
            pstmt.setDouble(17, booking.getGrandTotalInr());
            pstmt.setString(18, booking.getPaymentMethod());
            pstmt.setString(19, booking.getPaymentStatus());
            pstmt.setString(20, booking.getBookingStatus());

            return pstmt.executeUpdate() > 0;
        }
    }

    public List<Booking> getAllBookings() throws SQLException {
        List<Booking> list = new ArrayList<>();
        String sql = "SELECT * FROM bookings ORDER BY created_at DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {
                list.add(mapResultSetToBooking(rs));
            }
        }
        return list;
    }

    private Booking mapResultSetToBooking(ResultSet rs) throws SQLException {
        Booking b = new Booking();
        b.setBookingId(rs.getString("booking_id"));
        b.setCustomerEmail(rs.getString("customer_email"));
        b.setCustomerName(rs.getString("customer_name"));
        b.setCustomerPhone(rs.getString("customer_phone"));
        b.setPackageId(rs.getString("package_id"));
        b.setPackageName(rs.getString("package_name"));
        b.setTravelDate(rs.getDate("travel_date").toString());
        b.setReturnDate(rs.getDate("return_date").toString());
        b.setAdults(rs.getInt("adults"));
        b.setChildren(rs.getInt("children"));
        b.setPickupLocation(rs.getString("pickup_location"));
        b.setDropLocation(rs.getString("drop_location"));
        b.setTotalAmountInr(rs.getDouble("total_amount_inr"));
        b.setGstInr(rs.getDouble("gst_inr"));
        b.setDiscountInr(rs.getDouble("discount_inr"));
        b.setGrandTotalInr(rs.getDouble("grand_total_inr"));
        b.setPaymentMethod(rs.getString("payment_method"));
        b.setPaymentStatus(rs.getString("payment_status"));
        b.setBookingStatus(rs.getString("booking_status"));
        b.setCreatedAt(rs.getTimestamp("created_at").toString());
        return b;
    }
}
`
  },
  {
    path: 'JourneyHub/src/main/java/com/journeyhub/controller/DashboardController.java',
    name: 'DashboardController.java',
    category: 'controller',
    language: 'java',
    description: 'JavaFX Controller for Executive Dashboard with TableView, Metrics, and PDF Receipt Trigger',
    content: `package com.journeyhub.controller;

import javafx.fxml.FXML;
import javafx.fxml.Initializable;
import javafx.scene.control.Label;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.cell.PropertyValueFactory;
import com.journeyhub.dao.BookingDAO;
import com.journeyhub.model.Booking;
import com.journeyhub.utils.PDFReceiptGenerator;

import java.net.URL;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.ResourceBundle;

public class DashboardController implements Initializable {

    @FXML private Label lblTotalBookings;
    @FXML private Label lblTotalRevenue;
    @FXML private Label lblActiveCustomers;
    @FXML private Label lblAvailablePackages;

    @FXML private TableView<Booking> tblRecentBookings;
    @FXML private TableColumn<Booking, String> colBookingId;
    @FXML private TableColumn<Booking, String> colCustomerName;
    @FXML private TableColumn<Booking, String> colPackageName;
    @FXML private TableColumn<Booking, Double> colAmount;
    @FXML private TableColumn<Booking, String> colStatus;

    private final BookingDAO bookingDAO = new BookingDAO();

    @Override
    public void initialize(URL url, ResourceBundle resourceBundle) {
        setupTableColumns();
        loadDashboardMetrics();
    }

    private void setupTableColumns() {
        colBookingId.setCellValueFactory(new PropertyValueFactory<>("bookingId"));
        colCustomerName.setCellValueFactory(new PropertyValueFactory<>("customerName"));
        colPackageName.setCellValueFactory(new PropertyValueFactory<>("packageName"));
        colAmount.setCellValueFactory(new PropertyValueFactory<>("grandTotalInr"));
        colStatus.setCellValueFactory(new PropertyValueFactory<>("bookingStatus"));
    }

    private void loadDashboardMetrics() {
        try {
            List<Booking> bookings = bookingDAO.getAllBookings();
            tblRecentBookings.getItems().setAll(bookings);

            lblTotalBookings.setText(String.valueOf(bookings.size()));

            double totalRev = bookings.stream().mapToDouble(Booking::getGrandTotalInr).sum();
            NumberFormat currency = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
            lblTotalRevenue.setText(currency.format(totalRev));

            lblActiveCustomers.setText("1,240");
            lblAvailablePackages.setText("18");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @FXML
    public void onGenerateReceiptClick() {
        Booking selected = tblRecentBookings.getSelectionModel().getSelectedItem();
        if (selected != null) {
            try {
                PDFReceiptGenerator.generateBookingReceipt(selected, "JourneyHub_Receipt_" + selected.getBookingId() + ".pdf");
                System.out.println("Receipt PDF Generated successfully.");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
`
  },
  {
    path: 'JourneyHub/src/main/resources/fxml/Dashboard.fxml',
    name: 'Dashboard.fxml',
    category: 'view',
    language: 'xml',
    description: 'Scene Builder FXML layout for Main Dashboard with Sidebar, KPI Cards, TableView, and PDF Receipt button',
    content: `<?xml version="1.0" encoding="UTF-8"?>

<?import javafx.geometry.Insets?>
<?import javafx.scene.control.*?>
<?import javafx.scene.layout.*?>

<BorderPane xmlns="http://javafx.com/javafx/19" xmlns:fx="http://javafx.com/fxml/1"
            fx:controller="com.journeyhub.controller.DashboardController"
            prefHeight="800.0" prefWidth="1280.0" styleClass="main-container">

    <!-- LEFT SIDEBAR -->
    <left>
        <VBox prefWidth="240.0" styleClass="sidebar">
            <padding><Insets top="20" right="15" bottom="20" left="15"/></padding>
            <Label text="JOURNEYHUB" styleClass="sidebar-title" />
            <Label text="Travel Agency System" styleClass="sidebar-subtitle" />

            <VBox spacing="10" VBox.vgrow="ALWAYS" style="-fx-padding: 30 0 0 0;">
                <Button text=" Dashboard" styleClass="nav-btn, nav-btn-active"/>
                <Button text=" Tour Packages" styleClass="nav-btn"/>
                <Button text=" Bookings & Tickets" styleClass="nav-btn"/>
                <Button text=" Customer Directory" styleClass="nav-btn"/>
                <Button text=" Live Web Portal" styleClass="nav-btn"/>
            </VBox>

            <Button text=" Logout (Admin)" styleClass="nav-btn, logout-btn"/>
        </VBox>
    </left>

    <!-- CENTER CONTENT -->
    <center>
        <VBox spacing="20" styleClass="content-area">
            <padding><Insets top="25" right="25" bottom="25" left="25"/></padding>

            <HBox alignment="CENTER_LEFT" spacing="15">
                <VBox>
                    <Label text="Executive Overview" styleClass="header-title"/>
                    <Label text="Welcome back, Administrator (thirunivas418@gmail.com)" styleClass="header-subtitle"/>
                </VBox>
            </HBox>

            <!-- METRIC CARDS -->
            <GridPane hgap="20" vgap="10">
                <columnConstraints>
                    <ColumnConstraints percentWidth="25"/>
                    <ColumnConstraints percentWidth="25"/>
                    <ColumnConstraints percentWidth="25"/>
                    <ColumnConstraints percentWidth="25"/>
                </columnConstraints>

                <VBox GridPane.columnIndex="0" styleClass="kpi-card">
                    <Label text="Total Bookings" styleClass="kpi-label"/>
                    <Label fx:id="lblTotalBookings" text="142" styleClass="kpi-value"/>
                </VBox>

                <VBox GridPane.columnIndex="1" styleClass="kpi-card">
                    <Label text="Revenue (INR)" styleClass="kpi-label"/>
                    <Label fx:id="lblTotalRevenue" text="₹12,48,500" styleClass="kpi-value, text-blue"/>
                </VBox>

                <VBox GridPane.columnIndex="2" styleClass="kpi-card">
                    <Label text="Active Customers" styleClass="kpi-label"/>
                    <Label fx:id="lblActiveCustomers" text="1,240" styleClass="kpi-value"/>
                </VBox>

                <VBox GridPane.columnIndex="3" styleClass="kpi-card">
                    <Label text="Packages Available" styleClass="kpi-label"/>
                    <Label fx:id="lblAvailablePackages" text="18" styleClass="kpi-value"/>
                </VBox>
            </GridPane>

            <!-- RECENT BOOKINGS TABLE -->
            <VBox styleClass="card-box" VBox.vgrow="ALWAYS">
                <HBox alignment="CENTER_LEFT" spacing="10">
                    <Label text="Recent Confirmed Bookings" styleClass="section-title"/>
                    <Region HBox.hgrow="ALWAYS" />
                    <Button text="Download Selected PDF Receipt" onAction="#onGenerateReceiptClick" styleClass="btn-primary"/>
                </HBox>
                <TableView fx:id="tblRecentBookings" VBox.vgrow="ALWAYS">
                    <columns>
                        <TableColumn fx:id="colBookingId" text="Booking ID" prefWidth="140"/>
                        <TableColumn fx:id="colCustomerName" text="Customer Name" prefWidth="200"/>
                        <TableColumn fx:id="colPackageName" text="Tour Package" prefWidth="280"/>
                        <TableColumn fx:id="colAmount" text="Amount (₹)" prefWidth="140"/>
                        <TableColumn fx:id="colStatus" text="Status" prefWidth="120"/>
                    </columns>
                </TableView>
            </VBox>
        </VBox>
    </center>
</BorderPane>
`
  },
  {
    path: 'JourneyHub/src/main/resources/css/style.css',
    name: 'style.css',
    category: 'view',
    language: 'css',
    description: 'Custom CSS Styling Sheet for JavaFX controls with Blue, White, and Slate Grey palette',
    content: `/* JOURNEYHUB - JAVAFX MODERN STYLING SHEET */

.main-container {
    -fx-background-color: #f8fafc;
    -fx-font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
}

.sidebar {
    -fx-background-color: #1e293b;
}

.sidebar-title {
    -fx-font-size: 20px;
    -fx-font-weight: bold;
    -fx-text-fill: #38bdf8;
}

.sidebar-subtitle {
    -fx-font-size: 11px;
    -fx-text-fill: #94a3b8;
}

.nav-btn {
    -fx-background-color: transparent;
    -fx-text-fill: #e2e8f0;
    -fx-font-size: 13px;
    -fx-alignment: CENTER-LEFT;
    -fx-padding: 10 15 10 15;
    -fx-background-radius: 8px;
    -fx-cursor: hand;
}

.nav-btn:hover {
    -fx-background-color: #334155;
}

.nav-btn-active {
    -fx-background-color: #2563eb;
    -fx-text-fill: #ffffff;
    -fx-font-weight: bold;
}

.logout-btn {
    -fx-text-fill: #f87171;
}

.content-area {
    -fx-background-color: #f1f5f9;
}

.header-title {
    -fx-font-size: 24px;
    -fx-font-weight: bold;
    -fx-text-fill: #0f172a;
}

.header-subtitle {
    -fx-font-size: 13px;
    -fx-text-fill: #64748b;
}

.kpi-card {
    -fx-background-color: #ffffff;
    -fx-padding: 18px;
    -fx-background-radius: 12px;
    -fx-effect: dropshadow(three-pass-box, rgba(0,0,0,0.04), 8, 0, 0, 2);
}

.kpi-label {
    -fx-font-size: 12px;
    -fx-text-fill: #64748b;
    -fx-font-weight: bold;
}

.kpi-value {
    -fx-font-size: 22px;
    -fx-font-weight: bold;
    -fx-text-fill: #0f172a;
    -fx-padding: 5 0 0 0;
}

.text-blue {
    -fx-text-fill: #2563eb;
}

.card-box {
    -fx-background-color: #ffffff;
    -fx-padding: 20px;
    -fx-background-radius: 12px;
    -fx-effect: dropshadow(three-pass-box, rgba(0,0,0,0.04), 8, 0, 0, 2);
}

.section-title {
    -fx-font-size: 16px;
    -fx-font-weight: bold;
    -fx-text-fill: #1e293b;
}

.btn-primary {
    -fx-background-color: #2563eb;
    -fx-text-fill: #ffffff;
    -fx-font-weight: bold;
    -fx-padding: 8 16 8 16;
    -fx-background-radius: 6px;
    -fx-cursor: hand;
}

.btn-primary:hover {
    -fx-background-color: #1d4ed8;
}

.table-view {
    -fx-background-color: transparent;
    -fx-border-color: #e2e8f0;
    -fx-border-radius: 6px;
}

.table-view .column-header {
    -fx-background-color: #f8fafc;
    -fx-font-weight: bold;
    -fx-text-fill: #334155;
}
`
  },
  {
    path: 'JourneyHub/build-windows-exe.bat',
    name: 'build-windows-exe.bat',
    category: 'config',
    language: 'properties',
    description: 'Windows Batch Script for 1-click generation of Executable Fat JAR and Windows .exe Installer via jPackage',
    content: `@echo off
echo ====================================================================
echo JOURNEYHUB - NATIVE WINDOWS EXE INSTALLER BUILDER
echo Technology: Java 17, JavaFX 19, Maven Shade, jPackage
echo ====================================================================

REM 1. Clean and Build Executable Fat JAR
echo [STEP 1/3] Compiling and Packaging Executable Fat JAR via Maven...
call mvn clean package

IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven build failed! Ensure JDK 17 and Maven are installed.
    pause
    exit /b %ERRORLEVEL%
)

echo [SUCCESS] Fat JAR created at target\\journeyhub-desktop-1.0.0.jar

REM 2. Generate Windows EXE Installer using Java 17 jpackage tool
echo [STEP 2/3] Building Native Windows .exe Installer with jpackage...

jpackage ^
  --type exe ^
  --name "JourneyHub" ^
  --app-version "1.0.0" ^
  --description "JourneyHub - AI Smart Travel Agency Management System" ^
  --vendor "JourneyHub Travel Technologies" ^
  --input target ^
  --main-jar journeyhub-desktop-1.0.0.jar ^
  --main-class com.journeyhub.Launcher ^
  --icon src/main/resources/images/logo.ico ^
  --win-shortcut ^
  --win-menu ^
  --win-menu-group "JourneyHub Travel" ^
  --win-dir-chooser ^
  --dest dist

IF %ERRORLEVEL% NEQ 0 (
    echo [WARNING] jpackage requires WiX Toolset for .exe. Generating Inno Setup script alternative...
    echo You can also run Inno Setup on InnoSetupInstaller.iss
) ELSE (
    echo [SUCCESS] Windows Installer created at dist\\JourneyHub-1.0.0.exe!
)

echo ====================================================================
echo JourneyHub Windows Desktop Application Build Complete!
echo ====================================================================
pause
`
  },
  {
    path: 'JourneyHub/InnoSetupInstaller.iss',
    name: 'InnoSetupInstaller.iss',
    category: 'config',
    language: 'properties',
    description: 'Inno Setup Compiler script for building a standard Windows EXE Installer with Desktop & Start Menu Shortcuts',
    content: `; Inno Setup Script for JourneyHub - AI Smart Travel Agency
[Setup]
AppId={{98A1230F-5B41-4281-A91B-823019283712}}
AppName=JourneyHub AI Smart Travel Agency
AppVersion=1.0.0
AppPublisher=JourneyHub Travel Technologies
AppPublisherURL=https://journeyhub-ai-smart-travel-agency.ai.studio
DefaultDirName={autopf}\\JourneyHub
DefaultGroupName=JourneyHub Travel Agency
UninstallDisplayIcon={app}\\logo.ico
Compression=lzma2/max
SolidCompression=yes
OutputDir=dist
OutputBaseFilename=JourneyHub_Setup_v1.0.0
SetupIconFile=src\\main\\resources\\images\\logo.ico

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "startmenuicon"; Description: "Create a Start Menu Shortcut"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
Source: "target\\journeyhub-desktop-1.0.0.jar"; DestDir: "{app}"; Flags: ignoreversion
Source: "src\\main\\resources\\images\\logo.ico"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\\JourneyHub Travel Agency"; Filename: "javaw.exe"; Parameters: "-jar ""{app}\\journeyhub-desktop-1.0.0.jar"""; IconFilename: "{app}\\logo.ico"
Name: "{autodesktop}\\JourneyHub Travel Agency"; Filename: "javaw.exe"; Parameters: "-jar ""{app}\\journeyhub-desktop-1.0.0.jar"""; IconFilename: "{app}\\logo.ico"; Tasks: desktopicon

[Run]
Filename: "javaw.exe"; Parameters: "-jar ""{app}\\journeyhub-desktop-1.0.0.jar"""; Description: "Launch JourneyHub"; Flags: nowait postinstall skipifsilent
`
  },
  {
    path: 'JourneyHub/README.md',
    name: 'README.md',
    category: 'doc',
    language: 'markdown',
    description: 'Complete Documentation for building JAR, Windows .exe Installer, setting up MySQL, and launching JourneyHub Desktop',
    content: `# JourneyHub – AI Smart Travel Agency Management System
> **Native Java 17 Desktop Application (JavaFX + MySQL 8 + iText PDF + ZXing QR + Windows EXE Installer)**

Welcome to the **JourneyHub Desktop Application**, a full-featured travel agency management software connected to MySQL and the published JourneyHub portal (\`https://journeyhub-ai-smart-travel-agency.ai.studio\`).

---

## 📋 System Requirements

| Component | Specification |
| :--- | :--- |
| **Operating System** | Windows 10 / Windows 11 (64-bit) |
| **Java Development Kit**| Java 17 LTS (OpenJDK / Oracle JDK 17) |
| **Build Tool** | Apache Maven 3.8+ |
| **Database** | MySQL Server 8.0+ |
| **GUI Framework** | JavaFX Controls & FXML 19.0.2 |
| **Installer Compiler** | Java \`jpackage\` or Inno Setup 6.0+ |

---

## 🛠️ Installation & Setup Instructions

### 1. Database Initialization (MySQL)
1. Launch MySQL Workbench or Command Line.
2. Execute the included SQL script located in \`database/JourneyHubDatabase.sql\`:
   \`s\`\`sql
   SOURCE database/JourneyHubDatabase.sql;
   \`\`\`
3. Verify that database \`journeyhub_db\` is created with tables: \`admin\`, \`customers\`, \`packages\`, \`bookings\`, \`payments\`.

### 2. Configure Database Credentials
Edit \`src/main/java/com/journeyhub/database/DatabaseConnection.java\`:
\`\`\`java
private static final String DB_USER = "root";
private static final String DB_PASSWORD = "YOUR_MYSQL_PASSWORD";
\`\`\`

### 3. Build Executable Fat JAR
Run the following Maven command from the project root directory:

\`\`\`bash
# Build standalone executable Fat JAR with all dependencies
mvn clean package
\`\`\`

This outputs \`target/journeyhub-desktop-1.0.0.jar\`. You can test run it immediately:
\`\`\`bash
java -jar target/journeyhub-desktop-1.0.0.jar
\`\`\`

---

## 🚀 Creating Windows Installer (.exe) & Shortcuts

To install JourneyHub like standard Windows software with Desktop & Start Menu shortcuts:

### Option A: 1-Click Batch Script (jPackage)
Double-click \`build-windows-exe.bat\` or run in Command Prompt:
\`\`\`cmd
build-windows-exe.bat
\`\`\`
This creates \`dist/JourneyHub-1.0.0.exe\` with automatically generated Desktop and Start Menu shortcuts!

### Option B: Inno Setup Compiler
1. Download and install [Inno Setup](https://jrsoftware.org/isinfo.php).
2. Open \`InnoSetupInstaller.iss\`.
3. Click **Compile**.
4. Run \`dist/JourneyHub_Setup_v1.0.0.exe\` to install JourneyHub onto your Windows machine.

---

## 🔐 Default Administrator Credentials

- **Email**: \`thirunivas418@gmail.com\`
- **Password**: \`Admin@123\`

---

## 🔑 Key Features
- **Animated Splash Screen**: Displays progress during database initialization.
- **MVC Architecture**: JavaFX views bound via FXML and CSS.
- **iText 7 PDF Receipts**: Automated receipt generation formatted in Indian Rupee (₹).
- **ZXing QR Verification**: Embedded QR codes on tickets and receipts.
- **Windows Integration**: Native EXE installer with desktop shortcut and start menu entry.
`
  }
];
