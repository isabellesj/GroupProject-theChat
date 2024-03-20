export interface INavigation {
  toggleClass: () => void;
  isActive: boolean;
}
export const Navigation = ({ toggleClass, isActive }: INavigation) => {
  return (
    <>
      <div className="navigation">
        <div className={isActive ? "isactive" : "null"}>
          <a onClick={toggleClass}>···</a>
        </div>
      </div>
    </>
  );
};
