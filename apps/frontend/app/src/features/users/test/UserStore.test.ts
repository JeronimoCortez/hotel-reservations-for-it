import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "react-dom/test-utils";
import { useUserStore } from "../../../store/UserStore";

vi.mock("../../../features/users/services/UserService", () => ({
  userService: {
    login: vi.fn(() => Promise.resolve({ token: "fake-token" })),
    register: vi.fn(() => Promise.resolve({ message: "User created" })),
    listAll: vi.fn(() => Promise.resolve([
      { id: "u1", name: "Test", email: "a@b.com", role: "USER" }
    ])),
  },
}));

describe("UserStore", () => {
  beforeEach(() => {
    useUserStore.setState({ users: [], token: null, error: null, loading: false });
  });

  it("loginUser sets the auth token", async () => {
    await act(async () => {
      const token = await useUserStore.getState().loginUser({ email: "a@b.com", password: "123" });
      expect(token).toBe("fake-token");
    });

    expect(useUserStore.getState().token).toBe("fake-token");
  });

  it("fetchUsers loads all users", async () => {
    await act(async () => {
      await useUserStore.getState().fetchUsers();
    });

    const { users } = useUserStore.getState();
    expect(users.length).toBe(1);
    expect(users[0].name).toBe("Test");
  });
});
