import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ReadMore from "./ReadMore";
import EditDelete from "./EditDelete";

const EventItemText = async ({
  id,
  title,
  location,
  description,
  date,
  address,
  isDashboardPage,
}) => {
  return (
    <Card className={`md:col-2 max-w-[30ch]`} style={{ minWidth: "250px" }}>
      <CardHeader className="p-4 pb-2 relative">
        <CardTitle className="mb-1">{title}</CardTitle>
        <CardDescription className="mb-1">{date}</CardDescription>
        <CardDescription>{"17.00"}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p>{location.name}</p>
        <p className="mb-4">{address}</p>
        <p className="mb-2">{description}</p>
      </CardContent>
      <CardFooter
        className={`flex items-center justify-between p-4 ${
          isDashboardPage
            ? "flex-col items-start gap-2"
            : "flex-row items-center justify-between"
        }`}
      >
        {!isDashboardPage ? <ReadMore id={id} /> : <EditDelete id={id} />}
      </CardFooter>
    </Card>
  );
};

export default EventItemText;
