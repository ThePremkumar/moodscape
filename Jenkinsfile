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
                withCredentials([usernamePassword(
                    credentialsId: 'github-manifests',
                    usernameVariable: 'GIT_USERNAME',
                    passwordVariable: 'GIT_PASSWORD'
                )]){
                    checkout scm
                }

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
                    echo $ECR_REGISTRY

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
        stage('Update the image tag'){
            steps{
                withCredentials([usernamePassword(
                    credentialsId: 'github-manifests',
                    usernameVariable: 'GIT_USERNAME',
                    passwordVariable: 'GIT_PASSWORD'
                )]){

                    sh '''
                        set -e
                        rm -rf manifests

                        git clone --depth 1 https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/ThePremkumar/manifests.git
                        
                        cd manifests

                        sed -i "/name: moodscape-backend/{n;s|image: .*|image: $ECR_REGISTRY/moodscape-backend:${IMAGE_TAG}|;}" cd/k8s.yaml

                        sed -i "/name: moodscape-frontend/{n;s|image: .*|image: $ECR_REGISTRY/moodscape-frontend:${IMAGE_TAG}|;}" cd/k8s.yaml

                        git config user.name "ThePremkumar"
                        git config user.email "premkumar2462004@gmail.com"

                        git add cd/k8s.yaml
                        git diff --cached --quiet && echo "No changes to commit" || git commit -m "Update image to ${IMAGE_TAG}"
                        git push origin HEAD:main
                        
                    '''
                }
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