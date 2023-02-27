export async function hook(options) {
  console.log("PreDepoy Hook Running");
  console.log(options.argv);

  this.log("hi");
  console.log({ config: this.config });
}
