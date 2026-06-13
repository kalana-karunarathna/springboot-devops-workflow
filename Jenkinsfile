pipeline {
    agent any

    environment {
        SONARQUBE_SERVER = 'SonarQube'
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'

        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '016170083143'

        ECR_BACKEND_REPO = '016170083143.dkr.ecr.us-east-1.amazonaws.com/fma-backend'
        ECR_FRONTEND_REPO = '016170083143.dkr.ecr.us-east-1.amazonaws.com/fma-frontend'

        IMAGE_TAG = "build-${BUILD_NUMBER}"

        MAIL_TO = 'dasunkarunarathna07@gmail.com'
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

                    echo "AWS CLI:"
                    aws --version
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
                timeout(time: 10, unit: 'MINUTES') {
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

        stage('Login to AWS ECR') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        export AWS_DEFAULT_REGION=$AWS_REGION

                        echo "Checking AWS identity..."
                        aws sts get-caller-identity

                        echo "Logging in to AWS ECR..."
                        aws ecr get-login-password --region $AWS_REGION | \
                        docker login --username AWS --password-stdin \
                        $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    '''
                }
            }
        }

        stage('Build and Push Backend Image to ECR') {
            steps {
                sh '''
                    echo "Building backend Docker image..."
                    docker build -t fma-backend:$IMAGE_TAG ./$BACKEND_DIR

                    echo "Tagging backend image..."
                    docker tag fma-backend:$IMAGE_TAG $ECR_BACKEND_REPO:$IMAGE_TAG

                    echo "Pushing backend image to ECR..."
                    docker push $ECR_BACKEND_REPO:$IMAGE_TAG
                '''
            }
        }

        stage('Build and Push Frontend Image to ECR') {
            steps {
                sh '''
                    echo "Building frontend Docker image..."
                    docker build -t fma-frontend:$IMAGE_TAG ./$FRONTEND_DIR

                    echo "Tagging frontend image..."
                    docker tag fma-frontend:$IMAGE_TAG $ECR_FRONTEND_REPO:$IMAGE_TAG

                    echo "Pushing frontend image to ECR..."
                    docker push $ECR_FRONTEND_REPO:$IMAGE_TAG
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully. Images pushed to AWS ECR.'

            emailext(
                subject: "SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2>CI/CD Pipeline Completed Successfully</h2>

                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                    <p><b>Status:</b> SUCCESS</p>
                    <p><b>Image Tag:</b> ${env.IMAGE_TAG}</p>

                    <p><b>Backend ECR Image:</b><br>
                    ${env.ECR_BACKEND_REPO}:${env.IMAGE_TAG}</p>

                    <p><b>Frontend ECR Image:</b><br>
                    ${env.ECR_FRONTEND_REPO}:${env.IMAGE_TAG}</p>

                    <p><b>Build URL:</b><br>
                    <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>

                    <p>Docker images were built and pushed to AWS ECR successfully.</p>
                """,
                mimeType: 'text/html',
                to: "${env.MAIL_TO}"
            )
        }

        failure {
            echo 'Pipeline failed. Check the failed stage logs.'

            emailext(
                subject: "FAILED: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <h2>CI/CD Pipeline Failed</h2>

                    <p><b>Job:</b> ${env.JOB_NAME}</p>
                    <p><b>Build Number:</b> ${env.BUILD_NUMBER}</p>
                    <p><b>Status:</b> FAILED</p>

                    <p><b>Build URL:</b><br>
                    <a href="${env.BUILD_URL}">${env.BUILD_URL}</a></p>

                    <p>Please check the Jenkins console output to identify the failed stage.</p>
                """,
                mimeType: 'text/html',
                to: "${env.MAIL_TO}"
            )
        }

        always {
            echo 'Stopping Docker Compose containers...'
            sh 'docker compose down || true'
            echo 'Pipeline finished.'
        }
    }
}

