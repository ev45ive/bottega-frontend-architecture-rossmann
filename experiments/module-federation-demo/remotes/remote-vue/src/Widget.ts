import { defineComponent, h, ref, onMounted, onUnmounted, provide } from "vue";
import { QueryObserver } from "@tanstack/query-core";
import { store, loggedIn, loggedOut, type RootState } from "@mfe/shared-store";
import { queryClient, userProfileQuery } from "@mfe/shared-query";

// Vue has no react-redux equivalent, so this remote subscribes to the shared
// store directly and mirrors it into a ref — same singleton store instance either way.
export default defineComponent({
  name: "UserWidget",
  setup() {
    const isLoggedIn = ref(store.getState().user.isLoggedIn);
    const profileName = ref<string | null>(
      store.getState().user.profile?.name ?? null,
    );
    const queryProfile = ref<{ name: string; email: string } | null>(null);
    const queryLoading = ref(true);

    provide("store", store); // Redux store provider

    const observer = new QueryObserver(queryClient, userProfileQuery);
    let unsubscribeStore: (() => void) | undefined;
    let unsubscribeObserver: (() => void) | undefined;

    onMounted(() => {
      unsubscribeStore = store.subscribe(() => {
        const state: RootState = store.getState();
        isLoggedIn.value = state.user.isLoggedIn;
        profileName.value = state.user.profile?.name ?? null;
      });
      unsubscribeObserver = observer.subscribe((result) => {
        queryLoading.value = result.isLoading;
        queryProfile.value = result.data ?? null;
      });
    });

    onUnmounted(() => {
      unsubscribeStore?.();
      unsubscribeObserver?.();
    });

    function login() {
      if (queryProfile.value) {
        store.dispatch(
          loggedIn({
            profile: {
              id: "u1",
              name: queryProfile.value.name,
              email: queryProfile.value.email,
            },
            sessionToken: "mock-token",
          }),
        );
      }
    }

    function logout() {
      store.dispatch(loggedOut());
    }

    return () =>
      h(
        "div",
        {
          class: "remote-vue-widget",
          style: "border:1px solid #999;padding:1rem;border-radius:6px;",
        },
        [
          h("h3", null, "Session (Vue remote)"),
          h("p", null, [
            "Reads the shared Redux store via store.subscribe() and TanStack Query via a QueryObserver — both singletons from ",
            h("code", null, "@mfe/shared-store"),
            " / ",
            h("code", null, "@mfe/shared-query"),
            ".",
          ]),
          queryLoading.value ? h("p", null, "Loading profile…") : null,
          h(
            "p",
            null,
            `Session: ${isLoggedIn.value ? `logged in as ${profileName.value}` : "logged out"}`,
          ),
          h(
            "button",
            { type: "button", onClick: login, disabled: isLoggedIn.value },
            "Log in",
          ),
          h(
            "button",
            { type: "button", onClick: logout, disabled: !isLoggedIn.value },
            "Log out",
          ),
        ],
      );
  },
});
