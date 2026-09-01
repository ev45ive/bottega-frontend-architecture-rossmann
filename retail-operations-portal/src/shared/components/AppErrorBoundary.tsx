import { Component, type ErrorInfo, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";

interface Props {
  children: ReactNode;
  /** Tag shown in the error message — stands in for "which remote failed" once this is extracted. */
  boundaryName: string;
}

interface State {
  error: Error | null;
}

// Failure isolation demo material (Dzień 3): wrap a section so its crash doesn't take down the whole app.
export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.boundaryName}]`, error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <Alert variant="destructive">
          <AlertTitle>Sekcja "{this.props.boundaryName}" napotkała błąd</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{this.state.error.message}</p>
            <Button size="sm" variant="outline" onClick={() => this.setState({ error: null })}>
              Spróbuj ponownie
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    return this.props.children;
  }
}
