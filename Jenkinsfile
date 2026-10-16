
pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = 'thepremkumar'

        BACKEND_IMAGE = 'moodscape-backend'
        FRONTEND_IMAGE = 'moodscape-frontend'

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
                                -t ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                ./frontend
                        """
                    }
                }

                stage('Build Backend Image') {
                    steps {
                        sh """
                            docker build \
                                -t ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE}:${IMAGE_TAG} \
                                ./backend
                        """
                    }
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    sh '''
                        set +x
                        echo "$DOCKERHUB_TOKEN" | docker login \
                            --username "$DOCKERHUB_USER" \
                            --password-stdin
                    '''
                }
            }
        }

        stage('Push Frontend Image to Docker Hub') {
            steps {
                sh """
                    docker push \
                        ${DOCKERHUB_USERNAME}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage('Push Backend Image to Docker Hub') {
            steps {
                sh """
                    docker push \
                        ${DOCKERHUB_USERNAME}/${BACKEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage('Update Image Tags in Manifests') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'github-manifests',
                        usernameVariable: 'GIT_USERNAME',
                        passwordVariable: 'GIT_PASSWORD'
                    )
                ]) {
                    sh '''
                        set -eu
                        set +x

                        rm -rf manifests

                        git clone --depth 1 \
                            "https://${GIT_USERNAME}:${GIT_PASSWORD}@github.com/ThePremkumar/manifests.git" \
                            manifests

                        cd manifests

                        sed -i "/name: moodscape-backend/{n;s|image: .*|image: thepremkumar/moodscape-backend:${IMAGE_TAG}|;}" cd/k8s.yaml

                        sed -i "/name: moodscape-frontend/{n;s|image: .*|image: thepremkumar/moodscape-frontend:${IMAGE_TAG}|;}" cd/k8s.yaml

                        git config user.name "ThePremkumar"
                        git config user.email "premkumar2462004@gmail.com"

                        git add cd/k8s.yaml

                        if ! git diff --cached --quiet; then
                            git commit -m "Update Moodscape images to ${IMAGE_TAG}"
                            git push origin HEAD:main
                        else
                            echo "No manifest changes to commit."
                        fi
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded!"
            echo "Frontend: thepremkumar/moodscape-frontend:${IMAGE_TAG}"
            echo "Backend: thepremkumar/moodscape-backend:${IMAGE_TAG}"
        }

        failure {
            echo "Pipeline failed! Check the Jenkins console output."
        }

        always {
            sh 'docker logout || true'
            cleanWs()
        }
    }
}
