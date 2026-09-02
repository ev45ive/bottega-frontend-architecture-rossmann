// Async boundary required by Module Federation so the shared scope can init
// before any federated module (this one included) evaluates.
import('./bootstrap');
