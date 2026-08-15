pipeline {
    agent any

    environment {
        AWS_REGION = "us-east-1"
        ECR_REGISTRY = credentials('ECR_REGISTRY')

        BACKEND_IMAGE = "moodscape-backend"
        FRONTEND_IMAGE = "moodscape-frontend"

        IMAGE_TAG = "v${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            failFast true
            parallel {

                stage('Build Frontend Image') {
                    steps {
                        sh """
                            docker build \
                            -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                            ./frontend
                        """
                    }
                }

                stage('Build Backend Image') {
                    steps {
                        sh """
                            docker build \
                            -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                            ./backend
                        """
                    }
                }
            }
        }

        stage('Login to ECR') {
            steps {
                sh """
                    aws ecr get-login-password \
                    --region ${AWS_REGION} |
                    docker login \
                    --username AWS \
                    --password-stdin $ECR_REGISTRY
                """
            }
        }

        stage('Push Frontend Image to ECR') {
            steps {
                sh """
                    echo $ECR_REGISTRY
                    docker tag \
                    ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                    $ECR_REGISTRY/${FRONTEND_IMAGE}:${IMAGE_TAG}

                    docker push \
                    $ECR_REGISTRY/${FRONTEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage('Push Backend Image to ECR') {
            steps {
                sh """
                    docker tag \
                    ${BACKEND_IMAGE}:${IMAGE_TAG} \
                    $ECR_REGISTRY/${BACKEND_IMAGE}:${IMAGE_TAG}

                    docker push \
                    $ECR_REGISTRY/${BACKEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded!"
            echo "Images pushed with tag: ${IMAGE_TAG}"
        }

        failure {
            echo "Pipeline failed!"
        }

        always {
            sh 'docker logout $ECR_REGISTRY || true'
            cleanWs()
        }
    }
}