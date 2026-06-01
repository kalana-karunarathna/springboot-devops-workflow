pipeline {
    agent any

    environment {
        SONARQUBE_SERVER = 'SonarQube'
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Tool Versions') {
            steps {
                sh '''
                    echo "Java:"
                    java -version

                    echo "Maven:"
                    mvn -version

                    echo "Node:"
                    node -v

                    echo "NPM:"
                    npm -v

                    echo "Docker:"
                    docker --version

                    echo "Docker Compose:"
                    docker compose version
                '''
            }
        }

        stage('Backend Unit Tests') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'mvn test'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Backend Integration Tests / Verify') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'mvn verify'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        npm ci || npm install
                    '''
                }
            }
        }

        stage('Frontend Tests') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm run test'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm run build'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    dir("${BACKEND_DIR}") {
                        sh '''
                            mvn sonar:sonar \
                            -Dsonar.projectKey=fma-backend \
                            -Dsonar.projectName=fma-backend
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 3, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Docker Compose Build') {
            steps {
                sh 'docker compose build'
            }
        }

        

        stage('Docker Compose Up') {
            steps {
                sh 'docker compose up -d'
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'CI pipeline completed successfully.'
        }

        failure {
            echo 'CI pipeline failed. Check the failed stage logs.'
        }

        always {
            echo 'Pipeline finished.'
        }
    }
}