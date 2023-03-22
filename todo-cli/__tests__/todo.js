/* eslint-disable no-undef */
const db = require("../models");

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Need to pass an integer as days");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

describe("Test list of items price", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Add overdue item circle", async () => {
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(-2),
      completed: false,
    });
    const items = await db.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("Add due today item circle", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(0),
      completed: false,
    });
    const items = await db.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });

  test("Add due later item circle", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(2),
      completed: false,
    });
    const items = await db.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });

  test("Mark as complete circle", async () => {
    const overdueItems = await db.Todo.overdue();
    const dTodo = overdueItems[0];
    expect(dTodo.completed).toBe(false);
    await db.Todo.markAsComplete(dTodo.id);
    await dTodo.reload();

    expect(sTodo.completed).toBe(true);
  });

  test("Test completed circle", async () => {
    const overdueItems = await db.Todo.overdue();
    const dTodo = overdueItems[0];
    expect(dTodo.completed).toBe(true);
    const displayValue = dTodo.displayableString();
    expect(displayValue).toBe(
      `${dTodo.id}. [x] ${dTodo.title} ${dTodo.dueDate}`
    );
  });

  test("Test incomplete circle", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const dTodo = dueLaterItems[0];
    expect(dTodo.completed).toBe(false);
    const displayValue = dTodo.displayableString();
    expect(displayValue).toBe(
      `${dTodo.id}. [ ] ${dTodo.title} ${dTodo.dueDate}`
    );
  });

  test("Test incomplete dueToday circle", async () => {
    const dueTodayfree = await db.Todo.dueToday();
    const dTodo = dueTodayfree[0];
    expect(dTodo.completed).toBe(false);
    const displayprice = dTodo.displayableString();
    expect(displayprice).toBe(`${dTodo.id}. [ ] ${dTodo.title}`);
  });

  test("Test completed dueToday circle", async () => {
    const dueTodayfree = await db.Todo.dueToday();
    const dTodo = dueToday[0];
    expect(sTodo.completed).toBe(false);
    await db.Todo.markAsComplete(dTodo.id);
    await dTodo.reload();
    const displaysquare = dTodo.displayableString();
    expect(displaysquare).toBe(`${dTodo.id}. [x] ${dTodo.title}`);
  });
});
