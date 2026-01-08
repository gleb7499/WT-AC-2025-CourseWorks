Base-level manifests for the platform stack. Apply these with `kubectl apply -k k8s/base` (prefer overlays for real environments).

Included resources

- Namespace `app`
- Server: Deployment, Service, ConfigMap, Secret, HPA
- Web: Deployment, Service, ConfigMap
- PostgreSQL: Deployment, Service, PVC, Secret
- Redis: Deployment, Service, PVC
- Ingress: nginx class, routes `/api` → server (rewritten), `/` → web

Defaults and notes

- Images default to `server:latest` and `web:latest`; override via overlays or image tags when pushing to a registry.
- Resource requests/limits are set for minimal production-ready defaults; adjust in overlays.
- Secrets contain placeholder values — replace in overlays or via sealed/external secrets before production.
