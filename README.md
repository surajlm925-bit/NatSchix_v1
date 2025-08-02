# Multi-Subject Online Assessment Platform

A comprehensive, production-ready assessment platform with secure authentication, multi-subject testing, and administrative management capabilities.

## 🎯 Overview

This platform provides a complete solution for conducting online assessments across multiple subjects (Math, Science, Reasoning) with secure user authentication, randomized question selection, and comprehensive administrative controls.

## ✨ Key Features

### 🔐 Authentication & Security
- **Google OAuth2 Integration**: Secure login using Google accounts
- **Protected Routes**: Role-based access control for users and administrators
- **Session Management**: Secure session handling with localStorage persistence
- **Admin Authentication**: Password-protected admin panel access

### 📝 User Registration & Management
- **Comprehensive Registration Form**: Collects detailed user information including:
  - Personal details (name, email, phone, date of birth)
  - Address information (street, city, state, country)
  - Educational background (degree level, institution, field of study)
  - Professional experience and preferences
- **Registration Validation**: Form validation with required field enforcement
- **User Status Tracking**: Tracks registration completion status

### 🧪 Test Engine
- **Multi-Subject Testing**: Three core subjects with dedicated question pools
  - Mathematics (Algebra, Geometry, Calculus, Problem Solving)
  - Science (Physics, Chemistry, Biology, Earth Science)
  - Reasoning (Logical Reasoning, Analytical Thinking, Problem Solving)
- **Random Question Selection**: 20 questions per subject (60 total)
- **Interactive Features**:
  - Question navigation with status indicators
  - Mark for review functionality
  - Previous/Next navigation
  - Progress tracking with visual indicators
  - Countdown timer with visual alerts
- **Question Status System**:
  - Answered (green indicator)
  - Marked for review (orange indicator)
  - Unanswered (gray indicator)
- **Secure Submission**: Results stored server-side only

### 👨‍💼 Administrative Panel
- **Dashboard Overview**: Key metrics and recent activity
- **Question Management**:
  - Add, edit, delete questions by subject
  - Difficulty level assignment
  - Bulk import/export capabilities
- **Results Management**:
  - View all test results with detailed breakdowns
  - Subject-wise score analysis
  - Export functionality (CSV format)
- **User Management**:
  - View registered users
  - Track registration status and test completion
  - User activity monitoring
- **System Configuration**:
  - Test duration settings
  - Questions per subject configuration
  - Platform customization options

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **React Router** for client-side routing
- **Tailwind CSS** for responsive styling
- **Lucide React** for consistent iconography
- **Context API** for state management

### Backend Integration
- **PHP APIs** for server-side operations
- **MySQL Database** for data persistence
- **RESTful API Design** with proper HTTP methods
- **CORS Configuration** for cross-origin requests

### Database Schema
```sql
-- User registration data
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('male', 'female', 'other', 'prefer-not-to-say') NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL,
    education VARCHAR(50) NOT NULL,
    institution VARCHAR(100),
    field_of_study VARCHAR(100),
    experience VARCHAR(20),
    hear_about_us VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Question bank
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_answer INT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test results (admin-only access)
CREATE TABLE test_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    test_time DATETIME NOT NULL,
    subject VARCHAR(50) NOT NULL,
    questions JSON NOT NULL,
    answers JSON NOT NULL,
    score INT NOT NULL,
    duration_seconds INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subject management
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Trust, professionalism
- **Secondary**: Purple (#8B5CF6) - Innovation, creativity
- **Accent**: Green (#10B981) - Success, completion
- **Warning**: Amber (#F59E0B) - Attention, review
- **Error**: Red (#EF4444) - Alerts, critical actions
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold, clear hierarchy (text-4xl to text-lg)
- **Body Text**: Readable font sizes with proper line spacing
- **Code**: Monospace font for technical elements

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Cards**: Rounded corners with subtle shadows
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky headers with backdrop blur
- **Modals**: Centered overlays with backdrop

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PHP 7.4+ with MySQL support
- MySQL 5.7+ or MariaDB 10.3+
- Web server (Apache/Nginx) for production

### Development Setup
1. **Clone and Install**:
   ```bash
   git clone <repository-url>
   cd assessment-platform
   npm install
   ```

2. **Environment Configuration**:
   ```bash
   # Create .env file with:
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_API_BASE_URL=http://localhost/api
   ```

3. **Database Setup**:
   ```bash
   # Import schema
   mysql -u username -p database_name < database/schema.sql
   
   # Update API files with your database credentials
   # Edit api/*.php files with your MySQL connection details
   ```

4. **Start Development**:
   ```bash
   npm run dev
   ```

### Production Deployment

#### Hostinger Deployment
1. **Build the Application**:
   ```bash
   npm run build
   ```

2. **Upload Files**:
   - Upload `dist/` contents to `public_html/`
   - Upload `api/` folder to `public_html/api/`
   - Upload `database/schema.sql` and import via phpMyAdmin

3. **Configure Database**:
   - Create MySQL database via Hostinger panel
   - Import schema.sql
   - Update API files with production database credentials

4. **Set Up Google OAuth**:
   - Configure authorized origins in Google Console
   - Update production client ID in environment

## 📱 User Journey

### Student Flow
1. **Landing Page**: Introduction and login prompt
2. **Google Authentication**: Secure OAuth2 login
3. **Registration**: Complete detailed registration form
4. **Dashboard**: Test overview and instructions
5. **Assessment**: Take multi-subject test with navigation
6. **Completion**: Secure submission (no score visibility)

### Admin Flow
1. **Admin Login**: Password-protected access
2. **Dashboard**: Overview of platform metrics
3. **Question Management**: CRUD operations on question bank
4. **Results Review**: View and export test results
5. **User Management**: Monitor registrations and activity
6. **Configuration**: Adjust platform settings

## 🔒 Security Features

- **Authentication**: Google OAuth2 with secure token handling
- **Authorization**: Role-based access control
- **Data Protection**: Server-side result storage only
- **Input Validation**: Comprehensive form validation
- **SQL Injection Prevention**: Prepared statements in PHP
- **CORS Configuration**: Proper cross-origin request handling

## 📊 Analytics & Reporting

### Available Metrics
- Total registered users
- Test completion rates
- Subject-wise performance analysis
- Average test duration
- Question difficulty analysis

### Export Capabilities
- User registration data (CSV)
- Test results with detailed breakdowns (CSV)
- Question bank export/import (JSON)

## 🛠️ API Endpoints

### Registration
- `POST /api/save-registration.php` - Save user registration data

### Testing
- `POST /api/submit-test.php` - Submit test results

### Admin
- `GET /api/admin/get-results.php` - Fetch all test results
- `GET /api/admin/get-users.php` - Fetch user data
- `POST /api/admin/manage-questions.php` - Question CRUD operations

## 🔧 Configuration Options

### Test Settings
- Test duration (default: 120 minutes)
- Questions per subject (default: 20)
- Question randomization (enabled/disabled)
- Subject availability

### Platform Settings
- Platform name and branding
- Contact information
- Email notifications
- Result visibility settings

## 📈 Performance Optimizations

- **Code Splitting**: React lazy loading for route components
- **Image Optimization**: Responsive images with proper sizing
- **Caching**: Browser caching for static assets
- **Database Indexing**: Optimized queries with proper indexes
- **Minification**: Production build optimization

## 🧪 Testing Strategy

### Frontend Testing
- Component unit tests
- Integration tests for user flows
- E2E testing for critical paths

### Backend Testing
- API endpoint testing
- Database operation validation
- Security vulnerability assessment

## 📝 Future Enhancements

### Planned Features
- **Google Calendar Integration**: Schedule assessments
- **Advanced Analytics**: Detailed performance insights
- **Question Categories**: Subcategory organization
- **Bulk Operations**: Mass question import/export
- **Email Notifications**: Automated user communications
- **Mobile App**: Native mobile application
- **Proctoring**: Online supervision capabilities
- **Adaptive Testing**: Dynamic difficulty adjustment

### Technical Improvements
- **Real-time Updates**: WebSocket integration
- **Offline Support**: Progressive Web App features
- **Advanced Security**: Two-factor authentication
- **Scalability**: Microservices architecture
- **Monitoring**: Application performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For technical support or questions:
- Email: support@assessmentpro.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

---

**Built with ❤️ for educational excellence**