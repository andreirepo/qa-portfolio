#!/bin/bash

# Smart GitHub Runner Management Script
# Automatically manages runner lifecycle based on activity

set -e

REPO_URL="https://github.com/andreirepo/qa-portfolio"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"
RUNNER_NAME="proxmox-runner-$(hostname)"
CONTAINER_NAME="github-runner"
IDLE_TIMEOUT=1800  # 30 minutes in seconds

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

check_token() {
    if [ -z "$GITHUB_TOKEN" ]; then
        error "GITHUB_TOKEN environment variable is required"
        echo "💡 Usage: GITHUB_TOKEN=your_token ./smart-runner.sh [start|stop|status|auto]"
        exit 1
    fi
}

is_runner_active() {
    if docker ps --format "table {{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        return 0  # Running
    else
        return 1  # Not running
    fi
}

get_runner_uptime() {
    if is_runner_active; then
        docker inspect --format='{{.State.StartedAt}}' $CONTAINER_NAME | xargs -I {} date -d {} +%s
    else
        echo 0
    fi
}

start_runner() {
    log "🚀 Starting GitHub Actions Runner..."
    
    # Stop existing runner if any
    if is_runner_active; then
        warn "Runner already running, stopping first..."
        stop_runner
        sleep 5
    fi
    
    # Clean up any stopped containers
    docker rm $CONTAINER_NAME 2>/dev/null || true
    
    # Start new ephemeral runner
    log "🔄 Starting new runner: $RUNNER_NAME"
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -e REPO_URL="$REPO_URL" \
        -e ACCESS_TOKEN="$GITHUB_TOKEN" \
        -e RUNNER_NAME="$RUNNER_NAME" \
        -e RUNNER_WORKDIR="/tmp/runner/work" \
        -e EPHEMERAL="true" \
        -e DISABLE_AUTO_UPDATE="true" \
        -v /var/run/docker.sock:/var/run/docker.sock \
        -v /tmp/runner:/tmp/runner \
        myoung34/github-runner:latest
    
    # Wait and verify
    log "⏳ Waiting for runner to start..."
    sleep 15
    
    if is_runner_active; then
        success "GitHub runner started successfully!"
        log "📋 Runner name: $RUNNER_NAME"
        log "🔗 Repository: $REPO_URL"
        log "🌐 Verify at: $REPO_URL/settings/actions/runners"
    else
        error "Failed to start runner"
        docker logs $CONTAINER_NAME --tail=20
        exit 1
    fi
}

stop_runner() {
    log "🛑 Stopping GitHub Actions Runner..."
    
    if is_runner_active; then
        docker stop $CONTAINER_NAME
        docker rm $CONTAINER_NAME
        success "Runner stopped and removed"
    else
        warn "No running runner found"
    fi
}

show_status() {
    log "📊 Runner Status Check"
    echo "=========================="
    
    if is_runner_active; then
        success "Runner is ACTIVE"
        echo "Container: $CONTAINER_NAME"
        echo "Started: $(docker inspect --format='{{.State.StartedAt}}' $CONTAINER_NAME)"
        echo ""
        echo "Recent logs:"
        docker logs $CONTAINER_NAME --tail=10
    else
        warn "Runner is INACTIVE"
    fi
    
    echo ""
    echo "🌐 Check GitHub: $REPO_URL/settings/actions/runners"
}

auto_manage() {
    log "🤖 Auto-management mode started"
    log "Will check every 5 minutes and stop runner after ${IDLE_TIMEOUT}s of inactivity"
    
    while true; do
        if is_runner_active; then
            # Check if runner has been idle
            start_time=$(get_runner_uptime)
            current_time=$(date +%s)
            uptime=$((current_time - start_time))
            
            # Check for recent jobs (this is a simplified check)
            # In a real scenario, you'd check GitHub API for recent workflow runs
            recent_logs=$(docker logs $CONTAINER_NAME --since=5m 2>/dev/null | grep -i "job\|workflow\|running" | wc -l)
            
            if [ $recent_logs -eq 0 ] && [ $uptime -gt $IDLE_TIMEOUT ]; then
                log "🕐 Runner idle for ${uptime}s (>${IDLE_TIMEOUT}s), stopping..."
                stop_runner
            else
                log "✅ Runner active or within idle timeout (${uptime}s)"
            fi
        else
            log "💤 Runner not running, will start on-demand"
        fi
        
        sleep 300  # Check every 5 minutes
    done
}

# Main script logic
case "${1:-start}" in
    "start")
        check_token
        start_runner
        ;;
    "stop")
        stop_runner
        ;;
    "restart")
        check_token
        stop_runner
        sleep 3
        start_runner
        ;;
    "status")
        show_status
        ;;
    "auto")
        check_token
        auto_manage
        ;;
    "logs")
        if is_runner_active; then
            docker logs $CONTAINER_NAME -f
        else
            error "Runner is not running"
        fi
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|status|auto|logs]"
        echo ""
        echo "Commands:"
        echo "  start   - Start the runner"
        echo "  stop    - Stop the runner"
        echo "  restart - Restart the runner"
        echo "  status  - Show runner status"
        echo "  auto    - Auto-manage runner (start/stop based on activity)"
        echo "  logs    - Show runner logs"
        echo ""
        echo "Environment:"
        echo "  GITHUB_TOKEN - Required GitHub Personal Access Token"
        exit 1
        ;;
esac